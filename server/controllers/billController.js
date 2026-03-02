// controllers/billController.js
// FRONTEND LINK: Called from AdminMessBills.tsx and StudentMessBill.tsx
//   GET  /api/bills/:userId          → mockBills in src/lib/store.ts
//   POST /api/bills/generate-monthly → generate bills for all students
//   PUT  /api/bills/monthly-cost     → save monthly cost per day config

const MessBill = require('../models/MessBill');
const MonthlyCost = require('../models/MonthlyCost');

exports.getBillsByUser = async (req, res) => {
  try {
    const bills = await MessBill.find({ userId: req.params.userId }).sort({ year: -1, month: -1 });
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
    // TODO: Calculate totalDaysPresent from Attendance collection
    // and costPerDay from MonthlyCost for each student
    res.json({ message: 'Monthly bills generated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
