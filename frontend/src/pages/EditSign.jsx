import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiX } from "react-icons/fi";

export default function EditWordForm() {
  const { signId } = useParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [sign, setSign] = useState({
    word: "",
    meaning: "",
    description: "",
    image_file: null,
    image_preview: null
  });

  useEffect(() => {
    fetch(`http://localhost:3000/signs/${signId}`)
      .then(res => res.json())
      .then(data => {
        setSign({
          word: data.word,
          meaning: data.meaning,
          description: data.description,
          image_preview: data.image_data || null
        });
      })
      .catch(err => console.error("Error fetching sign:", err));
  }, [signId]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setSign(prev => ({
        ...prev,
        image_file: files[0],
        image_preview: URL.createObjectURL(files[0])
      }));
    } else {
      setSign(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("word", sign.word);
    formData.append("meaning", sign.meaning || "");
    formData.append("description", sign.description || "");
    if (sign.image_file) formData.append("image", sign.image_file);

    try {
      const res = await fetch(`http://localhost:3000/signs/${signId}`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());
      MySwal.fire("สำเร็จ!", "แก้ไขคำศัพท์เรียบร้อยแล้ว", "success");
      navigate(`/dashboard`);
    } catch (err) {
      console.error(err);
      MySwal.fire("ผิดพลาด", err.message, "error");
    }
  };

  return (
    <div className="relative p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      {/* ✅ ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        title="ยกเลิก"
      >
        <FiX size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-6">แก้ไขคำศัพท์</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="word"
          value={sign.word}
          onChange={handleChange}
          placeholder="คำศัพท์"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="meaning"
          value={sign.meaning}
          onChange={handleChange}
          placeholder="ความหมาย"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          value={sign.description}
          onChange={handleChange}
          placeholder="คำอธิบาย"
          className="w-full border px-3 py-2 rounded"
        />
        <input type="file" name="image" onChange={handleChange} />
        {sign.image_preview && (
          <img
            src={sign.image_preview}
            alt="Sign"
            className="w-32 h-32 mt-2 object-cover rounded-md shadow"
          />
        )}
        <div className="flex justify-end gap-3 pt-4">

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
