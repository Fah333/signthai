import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Variouslessons() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // ดึงข้อมูลบทเรียน
    const fetchLesson = fetch(`http://localhost:3000/lessons/${id}`).then(
      (res) => {
        if (!res.ok) throw new Error("ไม่พบบทเรียน");
        return res.json();
      }
    );

    // ดึงคำศัพท์ในบทเรียนนั้น
    const fetchSigns = fetch(`http://localhost:3000/signs/lesson/${id}`).then(
      (res) => {
        if (!res.ok) throw new Error("ไม่พบคำศัพท์");
        return res.json();
      }
    );

    Promise.all([fetchLesson, fetchSigns])
      .then(([lessonData, signsData]) => {
        setLesson(lessonData);
        setSigns(signsData); // Base64 หรือ video_url
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="p-6 text-red-500">เกิดข้อผิดพลาด: {error}</p>;
  if (!lesson) return <p className="p-6">ไม่พบบทเรียน</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ชื่อบทเรียน */}
      <h2 className="text-2xl font-bold mt-4">
        บทเรียนที่ {lesson.lesson_number}: {lesson.lesson_title || lesson.title}
      </h2>
      <p className="mt-2 text-gray-700">{lesson.description}</p>

      {lesson.lesson_number === 1 ? (
        // 🟢 แบบพิเศษสำหรับบทที่ 1 (Timeline / Accordion)
        <div className="mt-6">
          {signs.map((sign, index) => (
            <div key={sign.sign_id} className="flex items-start mb-6">
              {/* จุด timeline */}
              <div className="flex flex-col items-center mr-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                {index !== signs.length - 1 && (
                  <div className="flex-1 w-px bg-blue-300"></div>
                )}
              </div>

              {/* เนื้อหา */}
              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {sign.word}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{sign.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 🟢 แบบปกติสำหรับบทอื่น ๆ (คำศัพท์)
        <>
          <h3 className="text-xl font-semibold mt-6">คำศัพท์ / ท่ามือ</h3>
          {signs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-4 w-full max-w-3xl mx-auto">
              {signs.map((sign) => (
                <div
                  key={sign.sign_id}
                  className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow p-4"
                >
                  {/* รูป / วิดีโอ */}
                  <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
                    {sign.image_data ? (
                      <img
                        src={`data:image/jpeg;base64,${sign.image_data}`}
                        alt={sign.word}
                        className="max-w-full max-h-[400px] object-contain rounded"
                      />
                    ) : sign.video_url ? (
                      <video
                        controls
                        className="max-w-full max-h-[400px] rounded-lg"
                        src={sign.video_url}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">ไม่มีสื่อประกอบ</div>
                    )}
                  </div>

                  {/* ข้อความ */}
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-center md:pl-0">
                    <h4 className="font-bold text-xl mb-1">{sign.word}</h4>
                    <p className="text-lg text-gray-700 mb-1">{sign.meaning}</p>
                    <p className="text-sm text-gray-500 whitespace-pre-line">{sign.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-gray-500">ยังไม่มีคำศัพท์ในบทนี้</p>
          )}
        </>
      )}
    </div>
  );
}

export default Variouslessons;
