const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  qrCode: {
    type: String, // Base64 data URI of QR code
    required: true,
  },
  attendanceStatus: {
    type: String,
    enum: ['Pending', 'Attended', 'Cancelled'],
    default: 'Pending',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate registrations for same user and event (unless cancelled)
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
