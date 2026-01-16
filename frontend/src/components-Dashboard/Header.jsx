import { useEffect, useState } from "react";
import { Bell, MoreVertical } from "lucide-react";

export default function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/admins") // <-- เรียก API
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUsername(data[0].username); // เอาแค่ตัวแรก (หรือเลือกตามเงื่อนไข)
        }
      })
      .catch((err) => console.error("Error fetching admin:", err));
  }, []);

  return (
    <div className="flex justify-end items-center p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-semibold">{username || "Loading..."}</div>
          <div className="text-sm text-gray-500">Admin</div>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <Bell className="w-5 h-5 text-gray-600" />
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </div>
    </div>
  );
}
