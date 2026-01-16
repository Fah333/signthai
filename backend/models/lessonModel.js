const db = require('../DB/db');

const Lesson = {
  // ดึงบทเรียนทั้งหมด
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM lessons ORDER BY lesson_number ASC');

    // ✅ แปลง image_data เป็น base64 เพื่อให้ frontend แสดงได้
    return rows.map(row => ({
      ...row,
      image_data: row.image_data
        ? Buffer.from(row.image_data).toString('base64')
        : null
    }));
  },

  // ดึงบทเรียนตาม id พร้อม signs ของบทเรียน
  getById: async (id) => {
    const [lessonRows] = await db.query(
      `SELECT lesson_id, lesson_number, lesson_title, description, image_data 
       FROM lessons 
       WHERE lesson_id = ?`,
      [id]
    );

    if (lessonRows.length === 0) return null;

    const lesson = lessonRows[0];

    // ✅ แปลงรูปของบทเรียนเป็น base64
    if (lesson.image_data) {
      lesson.image_data = Buffer.from(lesson.image_data).toString('base64');
    }

    // ดึง signs ของบทเรียน
    const [signRows] = await db.query(
      `SELECT sign_id, word, meaning, image_data, video_url 
       FROM signs 
       WHERE lesson_number = ?`,
      [id]
    );

    // ✅ แปลงรูปของทุก sign เป็น base64 ด้วย
    lesson.signs = signRows.map(sign => ({
      ...sign,
      image_data: sign.image_data
        ? Buffer.from(sign.image_data).toString('base64')
        : null
    }));

    return lesson;
  },

  // สร้างบทเรียนใหม่
  create: async ({ lesson_number, lesson_title, description, image_data }) => {
    const [result] = await db.query(
      "INSERT INTO lessons (lesson_number, lesson_title, description, image_data) VALUES (?, ?, ?, ?)",
      [lesson_number, lesson_title, description, image_data]
    );
    return result.insertId;
  },

  // ลบบทเรียน
  deleteLesson: async (id) => {
    const [result] = await db.query('DELETE FROM lessons WHERE lesson_id = ?', [id]);
    return result.affectedRows > 0;
  },

  // อัปเดตบทเรียน
  updateLesson: async (id, { lesson_number, lesson_title, description, image_data }) => {
  const [result] = await db.query(
    `UPDATE lessons 
     SET lesson_number = ?, lesson_title = ?, description = ?, image_data = ? 
     WHERE lesson_id = ?`,
    [lesson_number, lesson_title, description, image_data, id]
  );
  return result.affectedRows > 0;
}
};

module.exports = Lesson;
