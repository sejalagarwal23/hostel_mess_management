// controllers/authController.js
// FRONTEND LINK: Called from Login.tsx via POST /api/auth/login
// Replace the mock login in src/lib/store.ts with:
//   const res = await fetch('http://localhost:5000/api/auth/login', {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ rollNumber, password, role })
//   });
//   const data = await res.json(); // { token, user }

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { rollNumber, password, role } = req.body;
    const user = await User.findOne({ rollNumber, role });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, rollNumber: user.rollNumber, role: user.role, phone: user.phone, email: user.email, hostelNumber: user.hostelNumber, semester: user.semester } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, rollNumber, password, role, phone, email, hostelNumber, semester } = req.body;
    const exists = await User.findOne({ rollNumber });
    if (exists) return res.status(400).json({ error: 'Roll number already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, rollNumber, password: hashed, role, phone, email, hostelNumber, semester });
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};