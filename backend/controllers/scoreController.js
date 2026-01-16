const jwt = require("jsonwebtoken");
const Score = require("../models/scoreModel");
const JWT_SECRET = process.env.JWT_SECRET_USER;

const scoreController = {
  addScore: async (req, res) => {
    try {
      // ถ้ามี token user ปกติ ใช้ req.user.user_id
      // ถ้า Guest ให้ใช้ user_id จาก body หรือสร้างชั่วคราว
      let user_id = req.user?.user_id;
      const { lesson_number, score, guest, username } = req.body;

      // ถ้าเป็น Guest ให้สร้าง Guest user id แบบชั่วคราว
      if (!user_id && guest) {
        // ตัวอย่าง: random id หรือใช้ timestamp
        user_id = `guest_${Date.now()}`;
        console.log("👤 Guest mode, assigned user_id:", user_id);
      }

      if (!user_id || !lesson_number) {
        return res.status(400).json({ error: "user_id หรือ lesson_number ไม่ถูกต้อง" });
      }


      console.log("📩 addScore body:", req.body);
      console.log("📩 addScore user_id:", user_id);
      console.log("Adding score:", { user_id, lesson_number, score });

      await Score.addScore({ user_id: user_id || null, lesson_number, score, username });
      res.json({ message: "Score added successfully" });
    } catch (err) {
      console.error("❌ addScore error:", err);
      res.status(500).json({ error: err.message });
    }
  }
  ,

  getAllScores: async (req, res) => {
    try {
      const scores = await Score.getAllScores();
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getScoresByLesson : async (req, res) => {
  try {
    const { lesson_number } = req.params;
    if (!lesson_number) return res.status(400).json({ message: "Missing lesson_number" });

    const scores = await Score.getScoresByLesson(lesson_number);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

  getMyScores: async (req, res) => {
    try {
      console.log("📩 user จาก token:", req.user); // ดู token ว่ามาจริงไหม
      const user_id = req.user.user_id;
      const scores = await Score.getScoresByUser(user_id);
      console.log("✅ ดึงคะแนนได้:", scores);
      res.json(scores);
    } catch (err) {
      console.error("❌ getMyScores error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = scoreController;

