import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function AddLesson() {
  const navigate = useNavigate();
  const [lessonNumber, setLessonNumber] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const MySwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ตรวจสอบว่ากรอกข้อมูลครบ
    if (!lessonNumber || !lessonTitle) {
      return MySwal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกเลขบทเรียนและชื่อบทเรียนให้ครบ",
        confirmButtonColor: "#3B82F6",
      });
    }

    const formData = new FormData();
    formData.append("lesson_number", lessonNumber);
    formData.append("lesson_title", lessonTitle);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:3000/lessons", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        MySwal.fire({
          icon: "success",
          title: "เพิ่มบทเรียนสำเร็จ 🎉",
          text: "ระบบได้บันทึกบทเรียนของคุณเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
          didClose: () => navigate("/dashboard"),
        });
      } else {
        const errData = await res.json();
        MySwal.fire({
          icon: "error",
          title: "ไม่สามารถเพิ่มบทเรียนได้ ❌",
          text: errData.error || "โปรดลองอีกครั้ง",
          confirmButtonColor: "#EF4444",
        });
      }
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด ⚠️",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
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
        title="ยกเลิก"
      >
        <FiX size={24} />
      </button>

      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        เพิ่มบทเรียนใหม่
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
        <div>
          <label className="block mb-1 text-sm font-medium">เลขบทเรียน</label>
          <input
            type="number"
            placeholder="เช่น 1"
            value={lessonNumber}
            onChange={(e) => setLessonNumber(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">ชื่อบทเรียน</label>
          <input
            type="text"
            placeholder="กรอกชื่อบทเรียน"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">คำอธิบาย</label>
          <textarea
            placeholder="รายละเอียดของบทเรียน"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">รูปภาพ</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-600 border rounded-md p-2 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          บันทึกบทเรียน
        </button>
      </form>
    </div>
  );
}
