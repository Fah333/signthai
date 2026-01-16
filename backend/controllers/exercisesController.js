const Exercise = require('../models/exerciseModel');
const Lesson = require('../models/lessonModel');
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const exercisesController = {
  getAllExercises: async (req, res) => {
    try {
      const exercises = await Exercise.getAll();
      res.json(exercises);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getExerciseById: async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Exercise.getById(id);
    if (!row) return res.status(404).json({ error: 'Exercise not found' });

    // ส่งตรง ๆ ให้ frontend ใช้งานได้
    res.json({
      exercise_id: row.exercise_id,
      lesson_number: row.lesson_number,
      question: row.question,
      option_a: row.option_a,
      option_b: row.option_b,
      option_c: row.option_c,
      option_d: row.option_d,
      correct_answer: row.correct_answer,
      image_data: row.image_data ? row.image_data.toString("base64") : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
}
,

  getExercisesByLessonNumber: async (req, res) => {
  try {
    const { lessonNumber } = req.params;
    const exercises = await Exercise.getExercisesByLessonNumber(lessonNumber);

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: "No exercises found for this lesson" });
    }

    // แปลงผลลัพธ์เป็นโครงสร้างที่ frontend ต้องการ
    const formatted = {
      title: `บทเรียน ${lessonNumber}`,
      questions: exercises.map(ex => ({
        question: ex.question,
        options: [ex.option_a, ex.option_b, ex.option_c, ex.option_d],
        answer: ex.correct_answer,
        image_data: ex.image_data  // <-- เพิ่มตรงนี้

      }))
    };

    res.json(formatted);
  } catch (err) {
    console.error("Error in getExercisesByLessonNumber:", err);
    res.status(500).json({ error: "Failed to fetch exercises for lesson" });
  }
},



  createExercise: [
  upload.single('image_data'),
  async (req, res) => {
    try {
      const lessonNumber = req.params.lessonNumber;
      const { question, option_a, option_b, option_c, option_d, correct_answer } = req.body;
      const image_data = req.file ? req.file.buffer : null;

      if (!lessonNumber || !question) {
        return res.status(400).json({ error: "lessonNumber and question are required" });
      }

      const id = await Exercise.create({
        lesson_number: parseInt(lessonNumber, 10),
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        image_data
      });

      res.json({ message: "Exercise created", id });
    } catch (err) {
      console.error("Error creating exercise:", err);
      res.status(500).json({ error: err.message });
    }
  }
],

  updateExercise: [
  upload.single('image_data'), // ต้องตรงกับ field จาก frontend
  async (req, res) => {
    try {
      const existingExercise = await Exercise.getById(req.params.id);
      if (!existingExercise) return res.status(404).json({ message: 'Exercise not found' });

      const exerciseData = {
        lesson_number: parseInt(req.body.lesson_number, 10),
        question: req.body.question,
        option_a: req.body.option_a,
        option_b: req.body.option_b,
        option_c: req.body.option_c,
        option_d: req.body.option_d,
        correct_answer: req.body.correct_answer,
        image_data: req.file ? req.file.buffer : existingExercise.image_data
      };

      const affectedRows = await Exercise.update(req.params.id, exerciseData);
      if (affectedRows === 0) return res.status(404).json({ message: 'Exercise not found' });

      res.json({ message: 'Exercise updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update exercise' });
    }
  }
],


  deleteExercise: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await Exercise.delete(id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Exercise not found' });
      res.json({ message: 'Exercise deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete exercise' });
    }
  }
};

module.exports = exercisesController;
