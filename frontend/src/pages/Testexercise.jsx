import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Testexercise() {
  const { lessonNumber } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  // ดึงข้อมูล user จาก localStorage
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userObj.user_id;
  const username = userObj.username;
  const token = userObj.token;

  // Fetch lesson
  useEffect(() => {
    fetch(`http://localhost:3000/exercises/lesson/${lessonNumber}`)

    
      .then((res) => res.json())
      .then((data) => setLesson(data))
      .catch((err) => console.error("Error fetching lesson:", err));
  }, [lessonNumber]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleFinish = useCallback(async () => {
    if (!lesson) return;

    const questions = lesson.questions || [];
    const answer = selectedOption || "ไม่ได้เลือก";
    const newUserAnswers = [...userAnswers, answer];

    // คำนวณคะแนน
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (newUserAnswers[idx] === q.answer) finalScore++;
    });

    setUserAnswers(newUserAnswers);
    setScore(finalScore);

    // POST คะแนนบทนี้
    try {
      const res = await fetch("http://localhost:3000/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user_id: userId || null,
          lesson_number: Number(lessonNumber),
          score: finalScore,
          guest: !userId,
          username: username || `Guest_${Date.now()}`,
        }),
      });
      const data = await res.json();
      console.log("POST /scores response:", data);
    } catch (err) {
      console.error("Save score error:", err);
    }

    setShowResult(true);
  }, [lesson, selectedOption, userAnswers, userId, token, username, lessonNumber]);

  // Countdown timer
  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, handleFinish]);

  if (!lesson) return <p className="text-center mt-10">Loading...</p>;

  const questions = lesson.questions;
  const question = questions[currentQuestion];

  const handleNext = () => {
    const answer = selectedOption || "ไม่ได้เลือก";
    setUserAnswers((prev) => [...prev, answer]);

    setSelectedOption("");
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinish();
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    setShowAnswers(false);
    setTimeLeft(90);
  };

  // ---------------- UI ----------------
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 50 && percentage < 80;

    return (
      <div className="px-6 py-12 flex justify-center bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-700 mb-4">คุณทำแบบทดสอบเสร็จแล้ว 🎉</p>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-6 rounded-xl shadow-lg mt-6 mb-6">
            <h2 className="text-6xl font-extrabold">
              {score} / {questions.length}
            </h2>
            <p className="text-lg mt-2">คะแนนรวม ({percentage}%)</p>
            <p className="mt-2 text-sm text-blue-100">
              เวลา: {formatTime(90 - timeLeft)}
            </p>
          </div>

          <div className="text-5xl mb-4">
            {isExcellent ? "🌟" : isGood ? "👍" : "💪"}
          </div>
          <p
            className={`text-lg font-semibold ${
              isExcellent ? "text-green-600" : isGood ? "text-blue-600" : "text-red-600"
            }`}
          >
            {isExcellent
              ? "ยอดเยี่ยมมาก! คุณเก่งสุด ๆ 👏"
              : isGood
              ? "ทำได้ดี! พยายามอีกนิด 💪"
              : "อย่าท้อ ลองใหม่อีกครั้งนะ! 💡"}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              onClick={handleRestart}
            >
              ทำอีกครั้ง
            </button>
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              onClick={() => setShowAnswers(true)}
            >
              ตรวจคำตอบ
            </button>
            <button
              className="px-5 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
              onClick={() => navigate(-1)}
            >
              กลับไปหน้าก่อน
            </button>
          </div>

          {showAnswers && (
            <div className="mt-10 text-left">
              <h2 className="text-xl font-bold mb-3 text-center text-blue-600">
                ตรวจคำตอบของคุณ
              </h2>
              {questions.map((q, idx) => {
                const userAnswer = userAnswers[idx] || "ไม่ได้เลือก";
                const isCorrect = userAnswer === q.answer;
                return (
                  <div
                    key={idx}
                    className={`p-4 mb-3 rounded-lg border ${
                      isCorrect ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"
                    }`}
                  >
                    <p className="font-semibold text-gray-800">
                      {idx + 1}. {q.question}
                    </p>
                    <p className="mt-1">
                      คำตอบของคุณ:{" "}
                      <span
                        className={`px-2 py-1 rounded ${
                          isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                      >
                        {userAnswer}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-green-700">คำตอบที่ถูกต้อง: {q.answer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- UI ทำแบบฝึกหัด ----
  return (
    <div className="px-4 py-12 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-gray-600 mt-1">
            ข้อ {currentQuestion + 1} / {questions.length}
          </p>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <p className={`mt-2 font-semibold ${timeLeft <= 10 ? "text-red-500" : "text-green-700"}`}>
            เวลาเหลือ: {formatTime(timeLeft)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg transition hover:shadow-xl">
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

          {question.image_data && (
            <div className="flex justify-center mb-4">
              <img
                src={`data:image/jpeg;base64,${question.image_data}`}
                alt="question"
                className="w-40 h-40 object-contain rounded"
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className={`p-3 rounded-lg border text-left ${
                  selectedOption === opt ? "bg-blue-500 text-white shadow" : "bg-white hover:bg-blue-50"
                }`}
                onClick={() => setSelectedOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-6 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500 disabled:opacity-50"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                  setSelectedOption(userAnswers[currentQuestion - 1] || "");
                }
              }}
              disabled={currentQuestion === 0}
            >
              ย้อนกลับ
            </button>

            <button
              className="px-6 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
              onClick={handleNext}
            >
              {currentQuestion + 1 < questions.length ? "ถัดไป" : "สรุปผล"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testexercise;
