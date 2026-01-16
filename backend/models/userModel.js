// src/models/userModel.js
const db = require("../DB/db"); // CommonJS
const bcrypt = require("bcrypt");

const User = {
  // สร้างผู้ใช้ใหม่ (Register)
  create: async ({ username, email, password }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );
    return { user_id: result.insertId, username };
  },

  // สร้าง Guest User
  createGuest: async (guestUsername) => {
    const guestEmail = `${guestUsername}@guest.com`;
    const guestPasswordHash = await bcrypt.hash("guest123", 10);

    const [result] = await db.execute(
      "INSERT INTO users (username, email, password, is_guest) VALUES (?, ?, ?, 1)",
      [guestUsername, guestEmail, guestPasswordHash]
    );

    return { user_id: result.insertId, username: guestUsername };
  },

  // หาผู้ใช้ด้วย email
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  // หาผู้ใช้ด้วย user_id
  findById: async (user_id) => {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );
    return rows[0];
  },

  // ดึงผู้ใช้ทั้งหมด
  getAllUsers: async () => {
    const [rows] = await db.execute("SELECT user_id, username, email FROM users");
    return rows;
  },

  // อัปเดตผู้ใช้
  update: async (user_id, data) => {
    const fields = [];
    const values = [];

    if (data.username) {
      fields.push("username = ?");
      values.push(data.username);
    }
    if (data.email) {
      fields.push("email = ?");
      values.push(data.email);
    }
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      fields.push("password = ?");
      values.push(hashed);
    }

    if (fields.length === 0) return 0;

    values.push(user_id);

    const [result] = await db.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`,
      values
    );

    return result.affectedRows;
  },

  // ลบผู้ใช้
  delete: async (user_id) => {
    const [result] = await db.execute(
      "DELETE FROM users WHERE user_id = ?",
      [user_id]
    );
    return result.affectedRows;
  },
};

module.exports = User; // CommonJS export
