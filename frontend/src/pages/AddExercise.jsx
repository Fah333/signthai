import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiX } from "react-icons/fi";

export default function AddExercise() {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [lessonId, setLessonId] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [image, setImage] = useState(null);
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
    if (!lessonId || !question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return MySwal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน",
        confirmButtonColor: "#3B82F6",
      });
    }

    const formData = new FormData();
    formData.append("lesson_id", parseInt(lessonId, 10));
    formData.append("question", question);
    formData.append("option_a", optionA);
    formData.append("option_b", optionB);
    formData.append("option_c", optionC);
    formData.append("option_d", optionD);
    formData.append("correct_answer", correctAnswer);
    if (image) formData.append("image_data", image);

    try {
      const res = await fetch(`http://localhost:3000/exercises/${lessonId}`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add exercise");
      }

      MySwal.fire({
        icon: "success",
        title: "เพิ่มแบบฝึกหัดสำเร็จ 🎉",
        text: "ระบบได้บันทึกแบบฝึกหัดของคุณเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
        didClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      console.error("Error adding exercise:", err);
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด ⚠️",
        text: err.message,
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="relative max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      {/* ปุ่มกากบาท */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        title="ย้อนกลับ"
      >
        <FiX size={24} />
      </button>

      <h1 className="text-2xl font-bold text-center mb-6">เพิ่มแบบฝึกหัดใหม่</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
        {/* เลือกบทเรียน */}
        <div>
          <label className="block mb-1 text-sm font-medium">เลือกบทเรียน</label>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
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

        {/* คำถาม */}
        <div>
          <label className="block mb-1 text-sm font-medium">คำถาม</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="กรอกคำถาม"
            className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ตัวเลือก */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="ตัวเลือก A"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="ตัวเลือก B"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="ตัวเลือก C"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="ตัวเลือก D"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* คำตอบที่ถูกต้อง */}
        <div>
          <label className="block mb-1 text-sm font-medium">คำตอบที่ถูกต้อง</label>
          <input
            type="text"
            placeholder="A/B/C/D"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* รูปภาพ */}
        <div>
          <label className="block mb-1 text-sm font-medium">รูปภาพ (ถ้ามี)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-600 border rounded-md p-2 cursor-pointer"
          />
        </div>

        {/* ปุ่มบันทึก */}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          บันทึกแบบฝึกหัด
        </button>
      </form>
    </div>
  );
}
