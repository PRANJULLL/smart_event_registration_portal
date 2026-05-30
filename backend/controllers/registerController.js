const Registration = require('../models/Registration');
const Event = require('../models/Event');
const generateQRCode = require('../utils/qrGenerator');

// Helper to generate a human-readable unique Ticket ID
const generateTicketId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ticketId = 'TKT-';
  for (let i = 0; i < 8; i++) {
    ticketId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ticketId;
};

// @desc    Register user for an event
// @route   POST /api/register
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // 2. Prevent registration if event is already completed
    if (event.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Event has already completed' });
    }

    // 3. Prevent registration after deadline
    const now = new Date();
    if (now > new Date(event.deadline)) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // 4. Prevent registration if capacity reached
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is fully booked (capacity reached)' });
    }

    // 5. Prevent duplicate registration
    const existingRegistration = await Registration.findOne({
      userId,
      eventId,
      attendanceStatus: { $ne: 'Cancelled' }, // Allow registering again if they cancelled previously
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    // 6. Generate unique ticket number
    let ticketId = generateTicketId();
    let ticketExists = await Registration.findOne({ ticketId });
    while (ticketExists) {
      ticketId = generateTicketId();
      ticketExists = await Registration.findOne({ ticketId });
    }

    // 7. Generate QR Code
    const qrCode = await generateQRCode(ticketId);

    // 8. Create Registration record
    const registration = await Registration.create({
      userId,
      eventId,
      ticketId,
      qrCode,
      attendanceStatus: 'Pending',
    });

    // 9. Increment registered count in Event
    event.registeredCount += 1;
    await event.save();

    // Populate event details before returning
    const populatedReg = await registration.populate('eventId');

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: populatedReg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user registrations
// @route   GET /api/register/user
// @access  Private
const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('eventId')
      .sort({ registrationDate: -1 });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/register/:id
// @access  Private
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Authorization: User can only cancel their own registration (admins can cancel any)
    if (registration.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to cancel this registration' });
    }

    if (registration.attendanceStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
    }

    // Mark as Cancelled
    registration.attendanceStatus = 'Cancelled';
    await registration.save();

    // Decrement registered count in Event
    const event = await Event.findById(registration.eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.json({ success: true, message: 'Registration cancelled successfully', data: registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
};
