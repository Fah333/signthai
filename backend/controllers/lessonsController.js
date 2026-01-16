const Lesson = require('../models/lessonModel');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const lessonsController = {
  // ✅ ดึงบทเรียนทั้งหมด
  getAllLessons: async (req, res) => {
    try {
      const lessons = await Lesson.getAll();

      const mapped = lessons.map(l => ({
        id: l.lesson_id,
        number: l.lesson_number,
        title: l.lesson_title,
        description: l.description,
        image_data: l.image_data
          ? `data:image/jpeg;base64,${l.image_data}`
          : null
      }));

      res.json(mapped);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ ดึงบทเรียนตาม ID
  getLessonById: async (req, res) => {
    try {
      const lesson = await Lesson.getById(req.params.id);

      if (!lesson) return res.status(404).json({ message: "Lesson not found" });

      // ✅ ไม่ต้อง Buffer.from() อีกแล้ว
      lesson.image_data = lesson.image_data
        ? `data:image/jpeg;base64,${lesson.image_data}`
        : null;

      if (lesson.signs && lesson.signs.length > 0) {
        lesson.signs = lesson.signs.map(sign => ({
          ...sign,
          image_data: sign.image_data
            ? `data:image/jpeg;base64,${sign.image_data}`
            : null,
        }));
      }

      res.json(lesson);
    } catch (err) {
      console.error("Error fetching lesson:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ เพิ่มบทเรียนใหม่
  createLesson: [
    upload.single('image'),
    async (req, res) => {
      try {
        const { lesson_number, lesson_title, description } = req.body;
        const imageData = req.file ? req.file.buffer : null;

        const id = await Lesson.create({
          lesson_number,
          lesson_title,
          description,
          image_data: imageData
        });

        res.json({ message: 'Lesson created', id });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    }
  ],


  // ✅ ลบบทเรียน
  deleteLesson: async (req, res) => {
    try {
      const deleted = await Lesson.deleteLesson(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Lesson not found' });
      res.json({ message: 'Lesson deleted' });
      console.log("req.file:", req.file);
    } catch (err) {
      console.error("Error deleting lesson:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ แก้ไขบทเรียน
  updateLesson: [
  upload.single('image'),
  async (req, res) => {
    try {
      const { lesson_number, lesson_title, description } = req.body;

      const number = parseInt(lesson_number, 10);
      if (isNaN(number)) return res.status(400).json({ error: "lesson_number must be a number" });

      const image_data = req.file ? req.file.buffer : null;

      const updated = await Lesson.updateLesson(req.params.id, {
        lesson_number: number,
        lesson_title,
        description,
        image_data
      });

      if (!updated) return res.status(404).json({ error: 'Lesson not found' });

      res.json({ message: 'Lesson updated' });
    } catch (err) {
      console.error("Error updating lesson:", err);
      res.status(500).json({ error: err.message });
    }
  }
]
};

module.exports = lessonsController;
