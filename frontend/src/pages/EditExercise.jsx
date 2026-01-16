import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiX } from "react-icons/fi";


export default function EditExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [exercise, setExercise] = useState({
    exercise_id: "",
    lesson_number: "",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    image_file: null,
    image_preview: null
  });

  useEffect(() => {
    fetch(`http://localhost:3000/exercises/${id}`)
      .then(res => res.json())
      .then(data => {
        setExercise({
          exercise_id: data.exercise_id,
          lesson_number: data.lesson_number,
          question: data.question,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          correct_answer: data.correct_answer,
          image_file: null,
          image_preview: data.image_data
            ? `data:image/jpeg;base64,${data.image_data}`
            : null
        });
      })
      .catch(err => console.error("Error fetching exercise:", err));
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setExercise(prev => ({
        ...prev,
        image_file: files[0],
        image_preview: URL.createObjectURL(files[0])
      }));
    } else {
      setExercise(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const confirm = await MySwal.fire({
      title: "ยืนยันการบันทึก",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก"
    });
    if (!confirm.isConfirmed) return;

    try {
      if (!exercise.question || !exercise.lesson_number) {
        throw new Error("กรุณากรอก Question และ Lesson NUMBER");
      }

      const formData = new FormData();
      formData.append("lesson_number", exercise.lesson_number);
      formData.append("question", exercise.question);
      formData.append("option_a", exercise.option_a);
      formData.append("option_b", exercise.option_b);
      formData.append("option_c", exercise.option_c);
      formData.append("option_d", exercise.option_d);
      formData.append("correct_answer", exercise.correct_answer);
      if (exercise.image_file)
        formData.append("image_data", exercise.image_file);

      const res = await fetch(
        `http://localhost:3000/exercises/${exercise.exercise_id}`,
        {
          method: "PUT",
          body: formData
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }

      MySwal.fire("สำเร็จ!", "แก้ไขคำถามเรียบร้อยแล้ว", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      MySwal.fire("ผิดพลาด", err.message, "error");
    }
  };

  return (
    <div className="relative max-w-lg mx-auto p-8 bg-white rounded-xl shadow-md">
      {/* ✅ ปุ่มกากบาท (ย้อนกลับ) */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        title="ยกเลิก"
      >
        <FiX size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-6">แก้ไขคำถาม</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="lesson_number"
          value={exercise.lesson_number}
          onChange={handleChange}
          placeholder="Lesson Number"
          className="w-full border px-3 py-2 rounded-md"
        />
        <textarea
          name="question"
          value={exercise.question}
          onChange={handleChange}
          placeholder="Question"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="option_a"
          value={exercise.option_a}
          onChange={handleChange}
          placeholder="Option A"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="option_b"
          value={exercise.option_b}
          onChange={handleChange}
          placeholder="Option B"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="option_c"
          value={exercise.option_c}
          onChange={handleChange}
          placeholder="Option C"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="option_d"
          value={exercise.option_d}
          onChange={handleChange}
          placeholder="Option D"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="correct_answer"
          value={exercise.correct_answer}
          onChange={handleChange}
          placeholder="Correct Answer (A/B/C/D)"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input type="file" name="image" onChange={handleChange} />
        {exercise.image_preview && (
          <img
            src={exercise.image_preview}
            alt="Exercise"
            className="mt-2 w-32 h-32 object-cover rounded-md shadow"
          />
        )}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
