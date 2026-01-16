import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Score() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ดึงข้อมูล user จาก localStorage
  const username = localStorage.getItem("username") || "Guest";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/scores/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScores(res.data);
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("เกิดข้อผิดพลาดในการโหลดคะแนน");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [userId, token]);

  const getFeedback = (score, total) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 80) return { text: "🌟 ยอดเยี่ยม", color: "text-green-600" };
    if (percentage >= 50) return { text: "👍 ทำได้ดี", color: "text-blue-600" };
    return { text: "💪 ต้องปรับปรุง", color: "text-red-600" };
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-xl text-gray-600">
        <p>กรุณาเข้าสู่ระบบก่อนดูคะแนน</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          ไปหน้าล็อกอิน
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        คะแนนของคุณ: {username}
      </h1>

      {scores.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>ยังไม่มีคะแนนในระบบ</p>
          <button
            onClick={() => navigate("/lessons")}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            ไปทำแบบฝึกหัด
          </button>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2">บทเรียน</th>
              <th className="border p-2">คะแนน</th>
              <th className="border p-2">Feedback</th>
              <th className="border p-2">วันที่ทำเสร็จ</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s) => {
              const feedback = getFeedback(s.score, s.total_questions || 10); // ใช้ total_questions จาก backend
              return (
                <tr key={s.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{s.lesson_title || `บทที่ ${s.lesson_number}`}</td>
                  <td className="border p-2 font-semibold text-green-700">{s.score}</td>
                  <td className={`border p-2 font-semibold ${feedback.color}`}>
                    {feedback.text}
                  </td>
                  <td className="border p-2 text-gray-500">
                    {new Date(s.completed_at).toLocaleString("th-TH")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
