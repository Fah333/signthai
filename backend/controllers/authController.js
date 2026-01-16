const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' });

        const admin = await Admin.getByEmail(email);
        if (!admin) return res.status(401).json({ message: 'Admin not found' });

        console.log("Request body:", req.body);
        console.log("Admin from DB:", admin);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        if (!admin.password) {
            return res.status(500).json({ message: 'Admin password missing in database' });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(401).json({ message: 'Incorrect password' });

        // สร้าง JWT token
        const token = jwt.sign(
            { admin_id: admin.admin_id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token, admin: { admin_id: admin.admin_id, email: admin.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginAdmin };
