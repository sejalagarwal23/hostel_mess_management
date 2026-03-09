// controllers/billController.js
// FRONTEND LINK: Called from AdminMessBills.tsx and StudentMessBill.tsx
//   GET  /api/bills/:userId          → mockBills in src/lib/store.ts
//   POST /api/bills/generate-monthly → generate bills for all students
//   PUT  /api/bills/monthly-cost     → save monthly cost per day config

const MessBill = require('../models/MessBill');
const MonthlyCost = require('../models/MonthlyCost');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.getStudentBills = async (req, res) => {
  try {
    const bills = await MessBill.find({ userId: req.params.studentId }).sort({ year: -1, month: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveMonthlyCosts = async (req, res) => {
  try {
    // req.body.costs = { 1: 120, 2: 130, ... 12: 110 }
    const { costs, year } = req.body;
    const ops = Object.entries(costs).map(([month, costPerDay]) =>
      MonthlyCost.findOneAndUpdate(
        { month: Number(month), year },
        { costPerDay: Number(costPerDay), updatedBy: req.user.id },
        { upsert: true, new: true }
      )
    );
    await Promise.all(ops);
    res.json({ message: 'Monthly costs saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateMonthlyBills = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    // get cost per day for that month
    const monthlyCost = await MonthlyCost.findOne({ month, year });

    if (!monthlyCost) {
      return res.status(400).json({ error: "Monthly cost not set for this month" });
    }

    const costPerDay = monthlyCost.costPerDay;

    // get all students
    const students = await User.find({ role: "student" });

    const bills = [];

    for (const student of students) {

      // count present days
      const attendance = await Attendance.find({
        userId: student._id,
        status: "present",
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1)
        }
      });

      const totalDaysPresent = attendance.length;

      const totalAmount = totalDaysPresent * costPerDay;

      const bill = await MessBill.findOneAndUpdate(
        { userId: student._id, month, year },
        {
          userId: student._id,
          month,
          year,
          totalDaysPresent,
          costPerDay,
          totalAmount,
          balance: totalAmount
        },
        { upsert: true, new: true }
      );

      bills.push(bill);
    }

    res.json({
      message: "Monthly bills generated successfully",
      totalStudents: bills.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlyCost = async (req, res) => {
  try {

    const { month, year } = req.query;

    const record = await MonthlyCost.findOne({ month, year });

    if (!record) {
      return res.json({ cost: 120 }); // default
    }

    res.json({ cost: record.costPerDay }); // ✅ FIXED

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly cost" });
  }
};