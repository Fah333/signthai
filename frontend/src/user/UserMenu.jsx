import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Guest";

  const logout = () => {
    // ล้างข้อมูล user
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");

    // ถ้ามีหน้าเดิมที่มาจาก login ให้กลับไปหน้าที่มาก่อน
    // ถ้าไม่มี ให้ไปหน้า login
    navigate(location.state?.from || "/home");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-500 hover:text-white"
      >
        ...
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50">
          <p className="px-4 py-2 font-semibold text-blue-600 truncate">{username}</p>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
