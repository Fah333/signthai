const db = require('../DB/db');

const Exercise = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM exercises ORDER BY exercise_id ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM exercises WHERE exercise_id = ?", [id]);
    return rows[0];
  },

  getExercisesByLessonNumber: async (lessonNumber) => {
    const [rows] = await db.query(
      'SELECT * FROM exercises WHERE lesson_number = ? ORDER BY exercise_id ASC',
      [lessonNumber]
    );
    return rows.map(row => ({
      ...row,
      image_data: row.image_data ? row.image_data.toString("base64") : null
    }));
  },

  create: async (exercise) => {
    const { lesson_number, question, option_a, option_b, option_c, option_d, correct_answer, image_data } = exercise;

    const [result] = await db.query(
      `INSERT INTO exercises 
     (lesson_number, question, option_a, option_b, option_c, option_d, correct_answer, image_data) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [lesson_number, question, option_a, option_b, option_c, option_d, correct_answer, image_data || null]
    );

    return result.insertId;
  }
  ,

  update: async (id, exercise) => {
    const { lesson_number, question, option_a, option_b, option_c, option_d, correct_answer, image_data } = exercise;

    if (!question || !lesson_number) {
      throw new Error("Question และ Lesson Number ต้องมีค่า");
    }

    const [result] = await db.query(
      `UPDATE exercises
     SET lesson_number = ?,
         question = ?,
         option_a = ?,
         option_b = ?,
         option_c = ?,
         option_d = ?,
         correct_answer = ?,
         image_data = ?
     WHERE exercise_id = ?`,
      [
        lesson_number,
        question,
        option_a || "",
        option_b || "",
        option_c || "",
        option_d || "",
        correct_answer || "",
        image_data || null,
        id
      ])
      ;

    return result.affectedRows; // ✅ ต้อง return
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM exercises WHERE exercise_id = ?', [id]);
    return result.affectedRows;
  },
};



module.exports = Exercise;
