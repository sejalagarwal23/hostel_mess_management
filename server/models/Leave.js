// models/Leave.js
// FRONTEND LINK: Used in AdminLeave.tsx — stores leave records assigned by admin

const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: String, required: true }, // YYYY-MM-DD
  toDate: { type: String, required: true },   // YYYY-MM-DD
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
