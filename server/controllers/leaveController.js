// controllers/leaveController.js
// FRONTEND LINK: Called from AdminLeave.tsx
//   POST /api/leave → assigns leave to a student

const Leave = require('../models/Leave');

exports.assignLeave = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.body;
    const leave = await Leave.create({ userId, fromDate, toDate, assignedBy: req.user.id });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeavesByUser = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.params.userId }).sort({ fromDate: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
