import React, { useEffect, useState, useRef } from "react";
import heroImage from "../assets/hero.webp";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function LessonsScroll() {
  const [lessons, setLessons] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/lessons")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.number - b.number);
        setLessons(sorted);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-6 bg-white relative">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">บทเรียนทั้งหมด</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          กดลูกศรเพื่อเลื่อนดูบทเรียนทั้งหมดได้เลย 👇
        </p>

        {/* ปุ่มลูกศรซ้าย */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-[350px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Container ที่เลื่อนด้วย ref */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div key={lesson.number} className="min-w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105 overflow-hidden">
                <Link to={`/lessons/${lesson.number}`}>
                  <img
                    src={lesson.image_data || "placeholder.jpg"}
                    alt={lesson.title}
                    className="w-full h-48 object-cover"
                  />
              </Link>
                <div className="p-6 text-left">
                  <h3 className="font-semibold text-lg">
                    บทที่ {lesson.number}: {lesson.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {lesson.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">กำลังโหลดบทเรียน...</p>
          )}
        </div>

        {/* ปุ่มลูกศรขวา */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-[350px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto h-[500px] md:h-[600px] overflow-hidden">
        <img
          src={heroImage}
          alt="ภาพตัวอย่างการเรียนรู้ภาษามือไทย"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-snug">
            เริ่มต้นเรียนรู้ภาษามือไทย <br /> อย่างเข้าใจง่าย
          </h1>
          <p className="mt-4 text-gray-200 max-w-2xl leading-relaxed">
            เรียนรู้ภาษาที่ใช้มือ สีหน้า และท่าทาง เพื่อการสื่อสารกับคนหูหนวก
            และเพิ่มโอกาสใหม่ในชีวิต
          </p>
          <Link to="/lessons">
            <button className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg transition">
              เริ่มเรียนรู้เลย
            </button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            ทำไมต้องเรียนภาษามือ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            ภาษามือช่วยเปิดโลกการสื่อสารใหม่ และสร้างความเข้าใจในสังคมที่หลากหลาย
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105">
              <div className="text-5xl text-blue-600">🤝</div>
              <h3 className="mt-4 font-semibold text-lg">
                สื่อสารกับคนหูหนวก
              </h3>
              <p className="text-gray-600 mt-2">
                พูดคุยได้ตรงๆ โดยไม่ต้องมีคนกลางช่วยแปล
              </p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105">
              <div className="text-5xl text-blue-600">💼</div>
              <h3 className="mt-4 font-semibold text-lg">
                เพิ่มโอกาสทางอาชีพ
              </h3>
              <p className="text-gray-600 mt-2">
                เช่น ล่ามภาษามือ ครูผู้สอน หรือสายงานบริการ
              </p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105">
              <div className="text-5xl text-blue-600">🌍</div>
              <h3 className="mt-4 font-semibold text-lg">เปิดโลกใหม่</h3>
              <p className="text-gray-600 mt-2">
                เข้าใจวัฒนธรรมและชุมชนคนหูหนวกมากขึ้น
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Lessons Scroll Section */}
      <LessonsScroll />
    </div>
  );
}

export default Home;
