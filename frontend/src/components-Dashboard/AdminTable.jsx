import React from "react";
import { Edit, X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

export default function AdminTable({ data }) {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // 🧩 ฟังก์ชันแก้ไขแอดมิน
  const handleEdit = (admin) => {
    navigate(`/edit-admin/${admin.admin_id}`);
  };

  // ❌ ฟังก์ชันลบแอดมิน
  const handleDelete = async (admin) => {
    const confirm = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: `ต้องการลบผู้ดูแลระบบ "${admin.username}" หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/admins/${admin.admin_id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          MySwal.fire("ลบสำเร็จ!", "ผู้ดูแลระบบถูกลบแล้ว", "success");
          window.location.reload(); // รีเฟรชข้อมูล
        } else {
          MySwal.fire("ผิดพลาด", "ไม่สามารถลบผู้ดูแลระบบได้", "error");
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Admin</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2">Username</th>
            <th className="pb-2">Email</th>
            <th className="pb-2"></th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{row.username}</td>
              <td>{row.email}</td>
              <td>{row.role}</td>
              <td className="flex gap-2 py-2">
                <Edit
                  className="w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                  onClick={() => handleEdit(row)}
                />
                <X
                  className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => handleDelete(row)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
