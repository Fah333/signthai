import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function AddSign() {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [lessonId, setLessonId] = useState("");
  const [lessonNumber, setLessonNumber] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/lessons")
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error("Error fetching lessons:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ตรวจสอบว่ากรอกข้อมูลครบ
    if (!lessonNumber || !word || !meaning) {
      return MySwal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "โปรดเลือกบทเรียนและกรอกคำศัพท์ภาษาไทยและภาษาอังกฤษให้ครบ",
        confirmButtonColor: "#3B82F6",
      });
    }

    const formData = new FormData();
    formData.append("lesson_number", lessonNumber);
    formData.append("word", word);
    formData.append("meaning", meaning);
    formData.append("description", description);
    formData.append("video_url", videoUrl);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`http://localhost:3000/signs/lesson/${lessonNumber}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add sign");
      }

      MySwal.fire({
        icon: "success",
        title: "เพิ่มคำศัพท์สำเร็จ 🎉",
        text: "ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
        didClose: () => navigate("/dashboard"),
      });

    } catch (err) {
      console.error("Error adding sign:", err);
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด ⚠️",
        text: err.message || "ไม่สามารถเพิ่มคำศัพท์ได้",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="relative max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
      {/* ปุ่มกากบาท */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        title="ย้อนกลับ"
      >
        <FiX size={24} />
      </button>

      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        เพิ่มคำศัพท์ใหม่
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
        {/* เลือกบทเรียน */}
        <div>
          <label className="block mb-1 text-sm font-medium">เลือกบทเรียน</label>
          <select
            value={lessonId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setLessonId(selectedId);
              const selectedLesson = lessons.find(l => l.id === parseInt(selectedId));
              setLessonNumber(selectedLesson ? selectedLesson.number : "");
            }}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">เลือกบทเรียน</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                บทที่ {l.number} - {l.title}
              </option>
            ))}
          </select>
        </div>

        {/* คำศัพท์ */}
        <div>
          <label className="block mb-1 text-sm font-medium">คำศัพท์ (ไทย)</label>
          <input
            type="text"
            placeholder="กรอกคำศัพท์ภาษาไทย"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ความหมาย */}
        <div>
          <label className="block mb-1 text-sm font-medium">คำศัพท์ (อังกฤษ)</label>
          <input
            type="text"
            placeholder="กรอกคำศัพท์ภาษาอังกฤษ"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* คำอธิบาย */}
        <div>
          <label className="block mb-1 text-sm font-medium">คำอธิบาย</label>
          <textarea
            placeholder="คำอธิบายของคำศัพท์"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* รูปภาพ */}
        <div>
          <label className="block mb-1 text-sm font-medium">รูปภาพ</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-600 border rounded-md p-2 cursor-pointer"
          />
        </div>

        {/* วิดีโอ */}
        <div>
          <label className="block mb-1 text-sm font-medium">ลิงก์วิดีโอ (ถ้ามี)</label>
          <input
            type="text"
            placeholder="https://example.com/video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          บันทึกคำศัพท์
        </button>
      </form>
    </div>
  );
}
