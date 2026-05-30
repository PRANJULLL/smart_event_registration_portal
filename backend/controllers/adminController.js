const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { convertToCSV } = require('../utils/csvExport');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    // 1. Core counters
    const totalEvents = await Event.countDocuments();
    const totalParticipants = await User.countDocuments({ role: 'user' });
    const totalRegistrations = await Registration.countDocuments({ attendanceStatus: { $ne: 'Cancelled' } });
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });

    // 2. Registrations per event (for charts)
    const eventsData = await Event.find({}, 'title registeredCount capacity').sort({ registeredCount: -1 }).limit(10);
    const registrationsPerEvent = eventsData.map(e => ({
      name: e.title.length > 20 ? e.title.substring(0, 20) + '...' : e.title,
      registrations: e.registeredCount,
      capacity: e.capacity,
    }));

    // 3. Registrations by category
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          registrations: { $sum: '$registeredCount' },
          events: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          value: '$registrations',
          events: '$events',
          _id: 0,
        },
      },
    ]);

    // 4. Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of month

    const monthlyStatsRaw = await Registration.aggregate([
      {
        $match: {
          registrationDate: { $gte: sixMonthsAgo },
          attendanceStatus: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$registrationDate' },
            month: { $month: '$registrationDate' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Map month numbers to names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRegistrations = monthlyStatsRaw.map(item => {
      return {
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        registrations: item.count,
      };
    });

    res.json({
      success: true,
      data: {
        cards: {
          totalEvents,
          totalParticipants,
          totalRegistrations,
          upcomingEvents,
        },
        registrationsPerEvent,
        categoryStats,
        monthlyRegistrations,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registrations with search & filter
// @route   GET /api/admin/registrations
// @access  Private/Admin
const getRegistrations = async (req, res) => {
  try {
    const { search, attendanceStatus } = req.query;
    let query = {};

    if (attendanceStatus && attendanceStatus !== 'All') {
      query.attendanceStatus = attendanceStatus;
    }

    // Since we need to search by user name/email or event title, we'll populate all and filter in memory,
    // or perform subqueries. Subqueries are much more performant on large databases.
    let userIds = [];
    let eventIds = [];

    if (search) {
      // Find matching users
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      });
      userIds = users.map(u => u._id);

      // Find matching events
      const events = await Event.find({
        title: { $regex: search, $options: 'i' },
      });
      eventIds = events.map(e => e._id);

      // Construct search query
      query.$or = [
        { userId: { $in: userIds } },
        { eventId: { $in: eventIds } },
        { ticketId: { $regex: search, $options: 'i' } },
      ];
    }

    const registrations = await Registration.find(query)
      .populate('userId', 'name email avatar')
      .populate('eventId', 'title date location startTime status')
      .sort({ registrationDate: -1 });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Scan ticket and confirm attendance
// @route   POST /api/admin/scan
// @access  Private/Admin
const scanTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: 'Ticket ID is required' });
    }

    const registration = await Registration.findOne({ ticketId })
      .populate('userId', 'name email')
      .populate('eventId', 'title date status');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Invalid ticket. Ticket code not found.' });
    }

    if (registration.attendanceStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Ticket cancelled. Participant cannot check in.' });
    }

    if (registration.attendanceStatus === 'Attended') {
      return res.json({
        success: true,
        alreadyAttended: true,
        message: 'Attendance already checked in previously!',
        data: registration,
      });
    }

    // Mark as Attended
    registration.attendanceStatus = 'Attended';
    await registration.save();

    res.json({
      success: true,
      alreadyAttended: false,
      message: 'Attendance confirmed successfully!',
      data: registration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export registrations as CSV
// @route   GET /api/admin/export
// @access  Private/Admin
const exportCSV = async (req, res) => {
  try {
    // Fetch all registrations
    const registrations = await Registration.find({})
      .populate('userId', 'name email')
      .populate('eventId', 'title')
      .sort({ registrationDate: -1 });

    const csvContent = convertToCSV(registrations);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=registrations_export.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStats,
  getRegistrations,
  scanTicket,
  exportCSV,
};
