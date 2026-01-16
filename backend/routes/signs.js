// backend/routes/signs.js
const express = require('express');
const router = express.Router();
const signsController = require('../controllers/signsController');
const multer = require('multer'); // <-- ต้อง import multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ดึง signs ทั้งหมด
router.get('/', signsController.getAllSigns);

// ดึง sign ทีละตัว
router.get('/:id', signsController.getSignById);

// ดึง signs ของบทเรียนหนึ่ง
router.get('/lesson/:lesson_number', signsController.getSignsByLesson);

// เพิ่ม sign ใหม่
router.post('/lesson/:lesson_number', signsController.createSign);

// แก้ไข sign
router.put('/:id', upload.single('image'), signsController.updateSign);

// ลบ sign
router.delete('/:id', signsController.deleteSign);

module.exports = router;
