const db = require("../DB/db"); // CommonJS require

const Score = {
  addScore: async ({ user_id, lesson_number, score, username }) => {
  await db.execute(
    "INSERT INTO scores (user_id, lesson_number, score, username) VALUES (?, ?, ?, ?)",
    [user_id, lesson_number, score, username]
  );
  return { id: result.insertId, user_id, username, lesson_number, score };

},

  getScoresByUser: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT s.id, s.lesson_number, l.lesson_title, s.score, s.completed_at
       FROM scores s
       JOIN lessons l ON s.lesson_number = l.lesson_number
       WHERE s.user_id = ?
       ORDER BY s.completed_at DESC`,
      [user_id]
    );
    return rows;
  },

  getAllScores: async () => {
    const [rows] = await db.execute(
      `SELECT s.id, s.user_id, u.username, s.lesson_number, l.lesson_title, s.score, s.completed_at
       FROM scores s
       JOIN users u ON s.user_id = u.user_id
       JOIN lessons l ON s.lesson_number = l.lesson_number
       ORDER BY s.completed_at DESC`
    );
    return rows;
  },
};

module.exports = Score;

