const db = require("../DB/db");

const Sign = {
  // ดึงข้อมูลทั้งหมด (พร้อมแปลงรูปภาพเป็น Base64)
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM signs ORDER BY sign_id ASC');
    return rows.map(row => ({
      ...row,
      image_data: row.image_data
        ? Buffer.from(row.image_data).toString('base64')
        : null
    }));
  },

  // ดึงตามบทเรียน (lesson_number)
  getByLessonNumber: async (lesson_number) => {
  const [rows] = await db.query('SELECT * FROM signs WHERE lesson_number = ?', [lesson_number]);
  return rows.map(row => ({
    ...row,
    image_data: row.image_data ? Buffer.from(row.image_data).toString('base64') : null
  }));
},


  // ดึง sign ทีละตัวตาม sign_id
getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM signs WHERE sign_id = ?", [id]);
    return rows[0];
  },


  create: async ({ lesson_number, word, meaning, description, video_url, image_data }) => {
    const [result] = await db.query(
      `INSERT INTO signs (lesson_number, word, meaning, description, video_url, image_data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [lesson_number, word, meaning, description, video_url, image_data]
    );
    return result.insertId;
  },

  // อัปเดตข้อมูล
  update: async (id, data) => {
  const { word, meaning, description, video_url, image_data } = data;
  const [result] = await db.query(
    "UPDATE signs SET word = ?, meaning = ?, description = ?, video_url = ?, image_data = ? WHERE sign_id = ?",
    [word, meaning, description, video_url, image_data, id]
  );
  return result.affectedRows; // ใช้ตรวจสอบว่า update สำเร็จ
},

  // ลบข้อมูล
  delete: async (id) => {
  const [result] = await db.query("DELETE FROM signs WHERE sign_id = ?", [id]);
  return result.affectedRows;
},
};

module.exports = Sign;
