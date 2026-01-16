// backend/routes/index.js
const express = require('express');
const router = express.Router();

// เรียก router ของแต่ละ module
const lessonsRoutes = require('./lessons'); 
const exercisesRoutes = require('./exercises');
const signsRoutes = require('./signs');
const adminRoutes = require('./admin');
const usersRoutes = require('./user');
const scoresRoutes = require('./score');


// ใช้ router สำหรับแต่ละ path
router.use('/lessons', lessonsRoutes);
router.use('/exercises', exercisesRoutes);
router.use('/signs', signsRoutes);
router.use('/admins', adminRoutes);
router.use('/user', usersRoutes);
router.use('/scores', scoresRoutes);

// route หลักสำหรับ /api
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Thai Sign Language API 🚀' });
});

module.exports = router;
