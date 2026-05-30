const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add an event description'],
  },
  category: {
    type: String,
    required: [true, 'Please add an event category'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Please upload a banner image'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  date: {
    type: Date,
    required: [true, 'Please add the event date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please add a start time'],
  },
  endTime: {
    type: String,
    required: [true, 'Please add an end time'],
  },
  organizer: {
    type: String,
    required: [true, 'Please specify the organizer name'],
  },
  capacity: {
    type: Number,
    required: [true, 'Please set the event capacity'],
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a registration deadline'],
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);
