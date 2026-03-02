// models/Notification.js
// FRONTEND LINK: Maps to Notification in src/lib/store.ts

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
