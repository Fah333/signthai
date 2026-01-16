const Sign = require('../models/signModel');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const signsController = {
  // ดึงสัญลักษณ์ทั้งหมด
  getAllSigns: async (req, res) => {
    try {
      const signs = await Sign.getAll();
      const mapped = signs.map(s => ({
        id: s.sign_id,
        word: s.word,
        meaning: s.meaning,
        video_url: s.video_url,
        lesson_id: s.lesson_id,
        image_data: s.image_data
          ? `data:image/jpeg;base64,${s.image_data}`
          : null
      }));
      res.json(mapped);
    } catch (err) {
      console.error("Error fetching signs:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ดึงสัญลักษณ์ตาม lesson_number
  getSignsByLesson: async (req, res) => {
  try {
    const lesson_number = parseInt(req.params.lesson_number, 10);
    const signs = await Sign.getByLessonNumber(lesson_number);
    res.json(signs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
,

  getSignById: async (req, res) => {
    try {
      const sign = await Sign.getById(req.params.id);
      if (!sign) return res.status(404).json({ message: "Sign not found" });
      res.json(sign);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // เพิ่มสัญลักษณ์ใหม่
  createSign: [
  upload.single('image'),
  async (req, res) => {
    try {
      const lesson_number = parseInt(req.params.lesson_number, 10); // ดึงจาก URL
      const { word, meaning, description, video_url } = req.body;

      if (!lesson_number || !word) {
        return res.status(400).json({ error: "lesson_id and word are required" });
      }

      const image_data = req.file ? req.file.buffer : null;

      const id = await Sign.create({
        lesson_number,
        word,
        meaning,
        description,
        video_url,
        image_data
      });

      res.json({ message: "Sign created", id });
    } catch (err) {
      console.error("Error creating sign:", err);
      res.status(500).json({ error: err.message });
    }
  }
],

  // แก้ไขข้อมูลสัญลักษณ์
  updateSign: async (req, res) => {
  try {
    const existingSign = await Sign.getById(req.params.id);
    if (!existingSign) return res.status(404).json({ message: 'Sign not found' });

    if (!req.body.word) return res.status(400).json({ error: "word cannot be empty" });

    const signData = {
      word: req.body.word,
      meaning: req.body.meaning || "",
      description: req.body.description || "",
      video_url: req.body.video_url || "",
      image_data: req.file ? req.file.buffer : existingSign.image_data
    };

    const affectedRows = await Sign.update(req.params.id, signData);
    res.json({ message: 'Sign updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
},


  // ลบสัญลักษณ์
  deleteSign: async (req, res) => {
    try {
      const affectedRows = await Sign.delete(req.params.id);
      if (affectedRows === 0)
        return res.status(404).json({ message: "Sign not found" });

      res.json({ message: "Sign deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

};

module.exports = signsController;
