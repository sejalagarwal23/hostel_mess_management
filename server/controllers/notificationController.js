// controllers/notificationController.js
// FRONTEND LINK: Called from AdminNotifications.tsx and StudentNotifications.tsx
//   GET  /api/notifications     → mockNotifications in src/lib/store.ts
//   POST /api/notifications     → send notification (admin only)

const Notification = require('../models/Notification');

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).populate('sentBy', 'name rollNumber');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { message } = req.body;
    const notification = await Notification.create({ message, sentBy: req.user.id });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
