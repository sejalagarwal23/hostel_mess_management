const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

exports.assignLeave = async (req, res) => {
  try {
    console.log("LEAVE REQUEST BODY:", req.body);
    const { userId, fromDate, toDate } = req.body;

    const leave = await Leave.create({
      userId,
      fromDate,
      toDate,
      assignedBy: req.user._id
    });

    let start = new Date(fromDate);
    let end = new Date(toDate);

   for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

  const formattedDate = d.toISOString().split("T")[0];

 await Attendance.findOneAndUpdate(
  { userId: userId, date: formattedDate },
  {
    $set: {
      userId: userId,
      date: formattedDate,
      status: "leave"
    }
  },
  { upsert: true, new: true }
);
}
    res.status(201).json(leave);

  } catch (err) {
  console.error("ASSIGN LEAVE ERROR:", err);
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

exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    await Attendance.deleteMany({
      userId: leave.userId,
      date: { $gte: leave.fromDate, $lte: leave.toDate },
      status: "leave"
    });

    await Leave.findByIdAndDelete(req.params.id);

    res.json({ message: "Leave deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};