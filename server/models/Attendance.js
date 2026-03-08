// models/Attendance.js
// FRONTEND LINK: Maps to AttendanceRecord in src/lib/store.ts

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // format: YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent', 'leave'], default: 'absent' },
}, { timestamps: true });

// Unique constraint: one record per user per date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
