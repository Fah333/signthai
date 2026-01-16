import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiX } from "react-icons/fi";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      return MySwal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกชื่อผู้ใช้, อีเมล และรหัสผ่านให้ครบทุกช่อง",
        confirmButtonColor: "#3B82F6",
      });
    }

    try {
      const res = await fetch("http://localhost:3000/admins/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "ไม่สามารถเพิ่มผู้ดูแลระบบได้");
      }

      MySwal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "เพิ่มผู้ดูแลระบบเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
        didClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        {/* 🔹 กากบาทอยู่บนฟอร์ม */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          title="ย้อนกลับ"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          เพิ่มผู้ดูแลระบบ
        </h2>

        <div>
          <label className="block mb-1 text-gray-600">ชื่อผู้ใช้</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="กรอกชื่อผู้ใช้"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">อีเมล</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="กรอกอีเมล"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่าน"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition mt-4"
        >
          บันทึกผู้ดูแลระบบ
        </button>
      </form>
    </div>
  );
}
