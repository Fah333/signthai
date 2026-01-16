const express = require("express");
const scoreController = require("../controllers/scoreController");
const authMiddleware = require("../controllers/authMiddleware"); // ตรวจสอบ path ให้ถูกต้อง

const router = express.Router();

router.post("/", authMiddleware, scoreController.addScore);
router.get("/me", authMiddleware, scoreController.getMyScores);
router.get("/", scoreController.getAllScores);


module.exports = router;
