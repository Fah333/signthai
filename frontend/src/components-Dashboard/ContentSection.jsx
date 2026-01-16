import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function ContentSection({ title, items, onDelete }) {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleEditLesson = async (lesson) => {
    const result = await MySwal.fire({
      title: "ยืนยันการแก้ไข",
      text: "คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลนี้?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      navigate(`/edit-lesson/${lesson.lesson_id}`);
    }
  };

  const handleEditSign = async (sign) => {
    const result = await MySwal.fire({
      title: "ยืนยันการแก้ไข",
      text: "คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลนี้?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      navigate(`/edit-word/${sign.lesson_id}/${sign.sign_id}`);
    }
  };

  const handleEditExercise = async (exercise) => {
    const result = await MySwal.fire({
      title: "ยืนยันการแก้ไข",
      text: "คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลนี้?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      navigate(`/edit-exercise/${exercise.exercise_id}`);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "ยืนยันการลบ",
      text: "เมื่อกดตกลง ข้อมูลนี้จะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      onDelete(id);
      MySwal.fire("ลบเรียบร้อย!", "ข้อมูลถูกลบแล้ว", "success");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-md">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">ไม่มีข้อมูล</p>
        ) : (
          <ul className="text-sm space-y-2">
            {items.map((item, index) => {
              const name = item.title || item.word || item.question || "N/A";

              return (
                <li
                  key={`${title}-${item.exercise_id || item.lesson_id || item.sign_id || item.id}-${index}`}
                  className="flex justify-between items-center border-b py-1"
                >
                  <span>{name}</span>
                  <div className="flex gap-2">
                    {/* Edit */}
                    {title.includes("บทเรียน") && <Edit onClick={() => handleEditLesson(item)} />}
                    {title.includes("คำศัพท์") && <Edit onClick={() => handleEditSign(item)} />}
                    {title.includes("คำถาม") && <Edit onClick={() => handleEditExercise(item)} />}

                    {/* Delete แยกตามประเภท */}
                    {title.includes("บทเรียน") && (
                      <Trash2 onClick={() => handleDelete(item.lesson_id)} />
                    )}
                    {title.includes("คำศัพท์") && (
                      <Trash2 onClick={() => handleDelete(item.sign_id)} />
                    )}
                    {title.includes("คำถาม") && (
                      <Trash2 onClick={() => handleDelete(item.exercise_id)} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

        )}
      </div>
    </div>
  );
}
