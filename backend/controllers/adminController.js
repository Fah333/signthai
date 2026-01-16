const Admin = require('../models/adminModel');

const AdminController = {
  // สร้าง admin
  createAdmin: async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields (username, password, email) are required' });
    }

    const id = await Admin.create({ username, password, email });
    res.json({ message: 'Admin created', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
},


  // ดึง admin ทั้งหมด
  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.getAll();
      res.json(admins);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ดึง admin ตาม id
  getAdminById: async (req, res) => {
    try {
      const id = req.params.id;
      const admin = await Admin.getById(id);
      if (!admin) return res.status(404).json({ error: 'Admin not found' });
      res.json(admin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // แก้ไข admin
  updateAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      const affectedRows = await Admin.update(id, req.body);
      if (affectedRows === 0) return res.status(404).json({ error: 'Admin not found or nothing changed' });
      res.json({ message: 'Admin updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ลบ admin
  deleteAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      const affectedRows = await Admin.delete(id);
      if (affectedRows === 0) return res.status(404).json({ error: 'Admin not found' });
      res.json({ message: 'Admin deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = AdminController;
