const express = require("express");
const userController = require("../controllers/userController");
const authuserController = require('../controllers/authuserController');


const router = express.Router();

router.post("/register", authuserController.registerUser);
router.post("/guest", userController.guestLogin);
router.post("/login", userController.login);

// ✅ /check ต้องมาก่อน /:user_id
router.get("/check", userController.checkLoginStatus);

router.get("/", userController.getAllUsers);
router.get("/:user_id", userController.getUserById);

// CRUD
router.put("/:user_id", userController.updateUser);
router.delete("/:user_id", userController.deleteUser);

module.exports = router;
