import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Barcode } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Card from "../components-Dashboard/Card";
import ContentSection from "../components-Dashboard/ContentSection";
import AdminTable from "../components-Dashboard/AdminTable";
import Header from "../components-Dashboard/Header";
import Sidebar from "../components-Dashboard/Sidebar";


export default function Dashboard() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [signs, setSigns] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [admins, setAdmins] = useState([]);

  const MySwal = withReactContent(Swal);

  // ฟังก์ชันแสดง SweetAlert popup
  const handleAddClick = () => {
  MySwal.fire({
    title: "เพิ่มข้อมูลใหม่",
    showConfirmButton: false,
    showCloseButton: true,
    focusConfirm: false,
    html: `
      <div class="flex flex-col gap-3">
        <button id="add-lesson" class="swal2-styled w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-600 transition-all">
          ➕ เพิ่มบทเรียน (Lesson)
        </button>
        <button id="add-sign" class="swal2-styled w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold hover:from-green-500 hover:to-green-600 transition-all">
          ✋ เพิ่มคำศัพท์ (Sign)
        </button>
        <button id="add-exercise" class="swal2-styled w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all">
          🧩 เพิ่มคำถาม (Exercise)
        </button>
        <button id="add-admin" class="swal2-styled w-full py-3 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold hover:from-gray-600 hover:to-gray-700 transition-all">
          👤 เพิ่มผู้ดูแลระบบ (Admin)
        </button>
      </div>
    `,
    customClass: {
      popup: 'p-6 rounded-2xl shadow-2xl', // popup ดูโมเดิร์น
    },
    didOpen: () => {
      document.getElementById("add-lesson")?.addEventListener("click", () => {
        MySwal.close();
        navigate("/add-lesson");
      });
      document.getElementById("add-sign")?.addEventListener("click", () => {
        MySwal.close();
        navigate("/add-sign");
      });
      document.getElementById("add-exercise")?.addEventListener("click", () => {
        MySwal.close();
        navigate("/add-exercise");
      });
      document.getElementById("add-admin")?.addEventListener("click", () => {
        MySwal.close();
        navigate("/add-admin");
      });
    }
  });
};




  useEffect(() => {
    fetchLessons();
    fetchSigns();
    fetchExercises();
    fetchAdmins();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch("http://localhost:3000/lessons");
      const data = await res.json();
      // data.map(...) ถ้า backend ส่ง id เป็น id
      const lessonsWithId = data.map(l => ({
        ...l,
        lesson_id: l.id || l.lesson_id // ✅ เพิ่ม lesson_id
      }));
      setLessons(lessonsWithId);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  };


  const fetchSigns = async () => {
    try {
      const res = await fetch("http://localhost:3000/signs");
      const data = await res.json();
      const signsWithId = data.map(s => ({
        ...s,
        sign_id: s.id || s.sign_id // ✅ เพิ่ม sign_id
      }));
      setSigns(signsWithId);
    } catch (err) {
      console.error("Error fetching signs:", err);
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await fetch("http://localhost:3000/exercises");
      const data = await res.json();
      const exercisesWithId = data.map(ex => ({
        ...ex,
        exercise_id: ex.id || ex.exercise_id // ✅ เพิ่ม exercise_id
      }));
      setExercises(exercisesWithId);
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:3000/admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  // เพิ่ม state สำหรับจำนวนเข้าชม
  const [visits, setVisits] = useState(0);
  const [contentCount, setContentCount] = useState(0);

  // useEffect เริ่มต้น
  useEffect(() => {
    // นับ visits แบบง่าย ๆ ใช้ localStorage
    const currentVisits = parseInt(localStorage.getItem("visits") || "0") + 1;
    localStorage.setItem("visits", currentVisits);
    setVisits(currentVisits);

    // ดึงข้อมูลจาก backend
    fetchLessons();
    fetchSigns();
    fetchExercises();
    fetchAdmins();
  }, []);

  // ปรับ fetchLesson, fetchWords, fetchQuestions
  useEffect(() => {
    setContentCount(lessons.length + signs.length + exercises.length);
  }, [lessons, signs, exercises]);



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <Header />
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card title="Total Users" value={visits} icon={Users} />
          <Card title="Content Items" value={contentCount} icon={Barcode} />
        </div>


        {/* Content Management */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Content Management</h2>
          <div className="flex justify-between items-center mb-6">
            <input
              />
            <button
              onClick={handleAddClick}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
              + Add
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContentSection
              title="บทเรียน"
              items={lessons}
              onDelete={async (lessonId) => {

                await fetch(`http://localhost:3000/lessons/${lessonId}`, { method: "DELETE" });
                fetchLessons();

              }}
            />



            <ContentSection
              title="คำศัพท์"
              items={signs}
              onDelete={async (signId) => {

                await fetch(`http://localhost:3000/signs/${signId}`, { method: "DELETE" });
                fetchSigns();

              }}
            />

            <ContentSection
              title="คำถาม"
              items={exercises}
              onDelete={async (exerciseId) => {

                await fetch(`http://localhost:3000/exercises/${exerciseId}`, { method: "DELETE" });
                fetchExercises();

              }}
            />

          </div>
        </section>

        {/* Admin Table */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Admin Management</h2>
          <AdminTable data={admins} />
        </section>
      </div>
    </div>
  );
}
