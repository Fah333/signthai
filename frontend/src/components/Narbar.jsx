import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, MoreVertical } from "lucide-react";
import { UserMenu } from "../user/UserMenu.jsx";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้เก็บหน้าเดิม
  const [lessons, setLessons] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const timeoutRef = useRef(null);
  const userId = localStorage.getItem("userId");


  // ดึง username จาก localStorage
  const [username, setUsername] = useState(localStorage.getItem("username") || null);

  useEffect(() => {
    fetch("http://localhost:3000/lessons")
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error(err));
  }, []);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
  };

  // ฟังก์ชัน logout ล้าง localStorage และอัปเดต state
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    setUsername(null);
    navigate(location.state?.from || "/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">THAI SIGN</h1>

        <ul className="flex gap-4 items-center relative">

          {/* หน้าแรก */}
          <li>
            <Link to="/" className="hover:text-blue-500 transition-colors">หน้าแรก</Link>
          </li>

          {/* Lessons Dropdown */}
          <li onMouseEnter={() => handleMouseEnter("lessons")} onMouseLeave={handleMouseLeave} className="relative">
            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
              <Link to="/lessons">บทเรียน</Link>
              <ChevronDown className={openMenu === "lessons" ? "rotate-180" : ""} size={16} />
            </div>
            <div className={`absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 transform transition-all duration-300 ${openMenu === "lessons" ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"} max-h-64 overflow-y-auto`}>
              <ul>
                {lessons.map(l => (
                  <li key={l.id}>
                    <Link to={`/lessons/${l.number}`} className="block px-4 py-2 hover:bg-blue-50">{`บท ${l.number} : ${l.title}`}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Exercises Dropdown */}
          <li onMouseEnter={() => handleMouseEnter("exercises")} onMouseLeave={handleMouseLeave} className="relative">
            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
              <Link to="/exercises">แบบฝึกหัด</Link>
              <ChevronDown className={openMenu === "exercises" ? "rotate-180" : ""} size={16} />
            </div>
            <div className={`absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 transform transition-all duration-300 ${openMenu === "exercises" ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"} max-h-64 overflow-y-auto`}>
              <ul>
                {lessons.map(l => (
                  <li key={l.id}>
                    <Link to={`/exercises/lesson/${l.id}`} className="block px-4 py-2 hover:bg-blue-50">{`แบบฝึกหัดบทที่ ${l.number} : ${l.title}`}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Username / UserMenu */}
          {username && (
            <li className="relative flex items-center gap-2">
              {/* Avatar */}
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`} // สุ่ม avatar ตามชื่อ
                alt="avatar"
                className="w-8 h-8 rounded-full border border-gray-300"
              />

              {/* ชื่อผู้ใช้ */}
              <span className="font-semibold text-blue-600">{username}</span>

              {/* ปุ่มเมนูเพิ่มเติม */}
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* เมนูผู้ใช้ */}
              {openUserMenu && (
                <div className="absolute right-0 top-10 w-40 bg-white shadow-lg rounded-md border border-gray-200">
                  <Link
                    to={`/score/${userId}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50"
                  >
                    ดูคะแนน
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}


        

          {/* Login */}
          {!username && (
            <li>
              <Link
                to="/login"
                state={{ from: location.pathname }} // ส่งหน้าปัจจุบันไป login
                className="border-2 border-green-500 text-green-600 px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white"
              >
                Login
              </Link>
            </li>
          )}

          {/* Admin */}
          {!username && (
            <li>
              <Link
                to="/admin/admin"
                className="border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                Admin
              </Link>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
