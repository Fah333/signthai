import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/lessons")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="px-6 py-12">

      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold">บทเรียนทั้งหมด</h1>
        <p className="text-gray-600 mt-2">
          บทเรียนทั้งหมด {lessons.length} บท
        </p>
      </div>

      {/* รายการบทเรียน */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {lessons.map((lesson, index) => (
          <Link
            to={`/lessons/${lesson.number}`}
            key={lesson.number || index}
            className="flex items-start bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {/* Circle Number */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg font-bold">
              {lesson.number || index + 1}
            </div>

            {/* Lesson Content */}
            <div className="ml-4">
              <h3 className="font-semibold text-lg">
                บทที่ {lesson.number || index + 1}: {lesson.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Lessons;
