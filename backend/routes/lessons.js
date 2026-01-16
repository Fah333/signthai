const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');

// ดึง lessons ทั้งหมด
router.get('/', lessonsController.getAllLessons);
router.get('/:id', lessonsController.getLessonById);
router.post('/', lessonsController.createLesson);
router.delete('/:id', lessonsController.deleteLesson);
router.put('/:id', lessonsController.updateLesson);

module.exports = router;
