import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Exercise() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ถ้าไม่ได้ล็อกอิน ให้เด้งไปหน้า login

    fetch("http://localhost:3000/lessons")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Error:", err));
  }, [navigate]);

  return (
    <div className="px-6 py-12">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold">แบบฝึกหัด</h1>
        <p className="text-gray-600 mt-2">ทั้งหมด {lessons.length} บท</p>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id || index}
            to={`/exercises/lesson/${lesson.id}`}
            className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg font-bold">
              {lesson.id || index + 1}
            </div>

            <div className="ml-4 text-left">
              <h3 className="font-semibold text-lg">
                บทที่ {lesson.id || index + 1}: {lesson.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Exercise;
