const db = require('../DB/db');
const bcrypt = require('bcryptjs');

const Admin = {
  create: async (admin) => {
  const { username, password, email } = admin;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email]
  );
  return result.insertId;
},

  getAll: async () => {
    const [rows] = await db.query('SELECT admin_id, username, email, created_at FROM admins ORDER BY admin_id ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT admin_id, username, email, created_at FROM admins WHERE admin_id=?', [id]);
    return rows[0];
  },

  update: async (id, admin) => {
  try {
    const { username, password, email } = admin;
    let query = 'UPDATE admins SET';
    const params = [];

    if (username) {
      query += ' username=?,';
      params.push(username);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ' password=?,';
      params.push(hashedPassword);
    }

    if (email) {
      query += ' email=?,';
      params.push(email);
    }

    // ลบ comma สุดท้าย
    query = query.replace(/,+$/, '');
    query += ' WHERE admin_id=?';
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows;
  } catch (err) {
    console.error('❌ Error in Admin.update:', err);
    throw err;
  }
},


  delete: async (id) => {
    const [result] = await db.query('DELETE FROM admins WHERE admin_id=?', [id]);
    return result.affectedRows;
  },


  getByEmail: async (email) => {
  const [rows] = await db.query('SELECT * FROM admins WHERE email=?', [email]);
  return rows[0];
},

};

module.exports = Admin;
