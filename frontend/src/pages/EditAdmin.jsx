import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiX } from "react-icons/fi";

export default function EditAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [admin, setAdmin] = useState({
    admin_id: "",
    username: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    fetch(`http://localhost:3000/admins/${id}`)
      .then(res => res.json())
      .then(data => {
        setAdmin({
          admin_id: data.admin_id,
          username: data.username,
          email: data.email,
          password: ""
        });
      })
      .catch(err => console.error("Error fetching admin:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
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
      if (!admin.username || !admin.email) throw new Error("กรุณากรอกชื่อและอีเมล");

      const body = {
        username: admin.username,
        email: admin.email
      };
      if (admin.password) body.password = admin.password;

      const res = await fetch(`http://localhost:3000/admins/${admin.admin_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${text}`);
      }

      MySwal.fire("สำเร็จ!", "แก้ไขผู้ดูแลระบบเรียบร้อยแล้ว", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating admin:", err);
      MySwal.fire("ผิดพลาด", `เกิดข้อผิดพลาดในการแก้ไขผู้ดูแลระบบ\n${err.message}`, "error");
    }
  };

  return (
    <div className="relative max-w-lg mx-auto p-8 bg-white rounded-xl shadow-md">
      {/* ปุ่มกากบาท */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        title="ยกเลิก"
      >
        <FiX size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">แก้ไขผู้ดูแลระบบ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={admin.username}
          onChange={handleChange}
          placeholder="ชื่อ"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="email"
          name="email"
          value={admin.email}
          onChange={handleChange}
          placeholder="อีเมล"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="password"
          name="password"
          value={admin.password}
          onChange={handleChange}
          placeholder="รหัสผ่าน (กรอกเฉพาะถ้าอยากเปลี่ยน)"
          className="w-full border px-3 py-2 rounded-md"
        />
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
