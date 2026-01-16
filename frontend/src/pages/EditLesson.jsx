import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiX } from "react-icons/fi";

export default function EditLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [lesson, setLesson] = useState({
    lesson_id: "",
    lesson_number: "",
    lesson_title: "",
    description: "",
    image_file: null,
    image_preview: null
  });

  useEffect(() => {
    fetch(`http://localhost:3000/lessons/${id}`)
      .then(res => res.json())
      .then(data => {
        setLesson({
          lesson_id: data.lesson_id,
          lesson_number: data.lesson_number,
          lesson_title: data.lesson_title,
          description: data.description,
          image_file: null,
          image_preview: data.image_data ? `data:image/jpeg;base64,${data.image_data}` : null
        });
      })
      .catch(err => console.error("Error fetching lesson:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setLesson(prev => ({
        ...prev,
        image_file: files[0],
        image_preview: URL.createObjectURL(files[0])
      }));
    } else {
      setLesson(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await MySwal.fire({
      title: "ยืนยันการบันทึก",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก"
    });
    if (!result.isConfirmed) return;

    try {
      if (!lesson.lesson_number) throw new Error("กรุณากรอกเลขบทเรียน");

      const formData = new FormData();
      formData.append("lesson_number", parseInt(lesson.lesson_number, 10));
      formData.append("lesson_title", lesson.lesson_title || "");
      formData.append("description", lesson.description || "");
      if (lesson.image_file) formData.append("image", lesson.image_file);

      const res = await fetch(`http://localhost:3000/lessons/${lesson.lesson_id}`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${text}`);
      }

      MySwal.fire("สำเร็จ!", "แก้ไขบทเรียนเรียบร้อยแล้ว", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating lesson:", err);
      MySwal.fire("ผิดพลาด", `เกิดข้อผิดพลาดในการแก้ไขบทเรียน\n${err.message}`, "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-md relative">
      {/* ✅ ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        title="ยกเลิก"
      >
        <FiX size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-6">แก้ไขบทเรียน</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="lesson_number"
          value={lesson.lesson_number}
          onChange={handleChange}
          placeholder="Lesson Number"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="lesson_title"
          value={lesson.lesson_title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded-md"
        />
        <textarea
          name="description"
          value={lesson.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input type="file" name="image" onChange={handleChange} />
        {lesson.image_preview && (
          <img
            src={lesson.image_preview}
            alt="Lesson"
            className="mt-2 w-32 h-32 object-cover rounded-md border"
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
