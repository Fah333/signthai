const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET_USER;

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ส่ง password แบบ plain ให้ model hash เอง
    const user = await User.create({ username, email, password });

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ username: user.username, user_id: user.user_id, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Email หรือ Password ไม่ถูกต้อง" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Email หรือ Password ไม่ถูกต้อง" });

    // ✅ ใส่ username ด้วย
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ username: user.username, user_id: user.user_id, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };
