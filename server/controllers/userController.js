// controllers/userController.js
// FRONTEND LINK: Called from AdminManageUsers.tsx
//   GET  /api/users         → getAllUsers() in src/lib/store.ts
//   GET  /api/users/:id     → user detail view
//   GET  /api/users/search?q=2021CS → search/filter users

const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q || '';
    const users = await User.find({
      $or: [
        { rollNumber: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ]
    }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
