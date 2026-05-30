const Event = require('../models/Event');
const Registration = require('../models/Registration');
const fs = require('fs');
const path = require('path');

// @desc    Get all events with search and filters
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    // Apply Search filter (title or location)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Apply Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Fetch events sorted by date
    const events = await Event.find(query).sort({ date: 1 });

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a banner image' });
    }

    const {
      title,
      description,
      category,
      location,
      date,
      startTime,
      endTime,
      organizer,
      capacity,
      deadline,
      status,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      startTime,
      endTime,
      organizer,
      capacity: Number(capacity),
      deadline,
      status: status || 'Upcoming',
      image: req.file.filename,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    // Cleanup uploaded file if DB creation failed
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Build update object
    const updateData = { ...req.body };

    // Handle capacity cast
    if (updateData.capacity) {
      updateData.capacity = Number(updateData.capacity);
    }

    // Handle new image upload
    if (req.file) {
      // Delete old banner image
      const oldImagePath = path.join(__dirname, '../uploads', event.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updateData.image = req.file.filename;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    // Cleanup uploaded file if update failed
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Delete associated registrations (or mark cancelled, let's delete them to be clean, or mark them cancelled)
    await Registration.deleteMany({ eventId: req.params.id });

    // Delete banner image from disk
    const imagePath = path.join(__dirname, '../uploads', event.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await event.deleteOne();

    res.json({ success: true, message: 'Event and associated registrations deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
