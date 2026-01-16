const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // CommonJS
const JWT_SECRET = process.env.JWT_SECRET_USER;

const userController = {
  // สร้าง user (Register)
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ error: "All fields required" });

      // ตรวจสอบว่ามี username หรือ email ซ้ำไหม
      const existingUser = await User.findByEmail(email);
      if (existingUser)
        return res.status(400).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });

      const token = jwt.sign(
        { user_id: user.user_id, username },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(201).json({
        message: "User registered",
        user_id: user.user_id,
        username,
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // Guest login
  guestLogin: async (req, res) => {
    try {
      const guestUsername = `Guest_${Date.now()}`;
      const userId = await User.createGuest(guestUsername);
      const token = jwt.sign(
        { user_id: userId, username: guestUsername },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      // ✅ เพิ่ม user_id กลับมาด้วย
      res.json({
        message: "Guest login successful",
        user_id: userId,
        username: guestUsername,
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password required" });

      const user = await User.findByEmail(email);
      if (!user) return res.status(400).json({ message: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
        { user_id: user.user_id, username: user.username },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      // ✅ เพิ่ม user_id ใน response
      res.json({
        message: "Login successful",
        user_id: user.user_id,
        username: user.username,
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ตรวจสอบ login status
  checkLoginStatus: async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        // ส่ง username ด้วย
        res.json({ user: { user_id: decoded.user_id, username: decoded.username } });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ดึงผู้ใช้ทั้งหมด
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ดึงผู้ใช้ตาม id
  getUserById: async (req, res) => {
    try {
      const { user_id } = req.params;
      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // แก้ไขผู้ใช้
  updateUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const affectedRows = await User.update(user_id, req.body);
      if (affectedRows === 0) return res.status(404).json({ message: "User not found or nothing changed" });
      res.json({ message: "User updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ลบผู้ใช้
  deleteUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const affectedRows = await User.delete(user_id);
      if (affectedRows === 0) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = userController;
