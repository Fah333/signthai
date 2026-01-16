import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { FiHome, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      await Swal.fire({
        icon: "success",
        title: "ออกจากระบบเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/admin/admin");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/Dashboard" },
    { name: "Logout", icon: <FiLogOut />, action: handleLogout },
  ];

  return (
    <aside className="w-64 h-full-screen bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg rounded-r-lg">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
        <nav className="flex flex-col space-y-3">
          {menuItems.map((item) =>
            item.action ? (
              <button
                key={item.name}
                onClick={item.action}
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                {item.icon}
                {item.name}
              </button>
            ) : (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200 ${
                  location.pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            )
          )}
        </nav>
      </div>
      <div className="text-center text-sm text-gray-400 mt-6">
        &copy; {new Date().getFullYear()} SignThai
      </div>
    </aside>
  );
}
