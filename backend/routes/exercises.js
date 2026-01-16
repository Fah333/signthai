const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// ดึง exercises ทั้งหมด
router.get('/', exercisesController.getAllExercises);

// ดึง exercise ตาม id
router.get('/:id', exercisesController.getExerciseById);

// เพิ่ม exercise ใน lessonNumber ที่ระบุ
router.post('/:lessonNumber', exercisesController.createExercise);

// แก้ไข exercise ตาม id
router.put('/:id', exercisesController.updateExercise);

// ลบ exercise ตาม id
router.delete('/:id', exercisesController.deleteExercise);

// ดึง exercises ทั้งหมดของ lesson ตาม lesson_number
router.get('/lesson/:lessonNumber', exercisesController.getExercisesByLessonNumber);

module.exports = router;
