// controllers/attendanceController.js
// FRONTEND LINK: Called from AdminAttendance.tsx and StudentAttendance.tsx
//   GET  /api/attendance/:userId?month=2025-01 → mockAttendance in src/lib/store.ts
//   POST /api/attendance                        → mark attendance

const Attendance = require('../models/Attendance');

exports.getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.query; // e.g. "2025-01"
    const filter = { userId };
    if (month) filter.date = { $regex: `^${month}` };
    const records = await Attendance.find(filter).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { userId, date, status } = req.body;

    const existing = await Attendance.findOne({ userId, date });

    // 🚫 Do not overwrite leave
    if (existing && existing.status === "leave") {
      return res.json({
        message: "Student is on leave. Attendance not modified.",
        attendance: existing
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date },
      {
        $set: {
          userId,
          date,
          status
        }
      },
      { upsert: true, new: true }
    );

    res.json(attendance);

  } catch (err) {
    console.error("ATTENDANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};