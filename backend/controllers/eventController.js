const Event = require('../models/Event');
const Registration = require('../models/Registration');
const fs = require('fs');
const path = require('path');

const getSampleEventsData = () => {
  const dateTech = new Date();
  dateTech.setDate(dateTech.getDate() + 45);
  const deadlineTech = new Date(dateTech);
  deadlineTech.setDate(deadlineTech.getDate() - 1);

  const dateMusic = new Date();
  dateMusic.setDate(dateMusic.getDate() + 60);
  const deadlineMusic = new Date(dateMusic);
  deadlineMusic.setDate(deadlineMusic.getDate() - 1);

  const dateArt = new Date();
  dateArt.setDate(dateArt.getDate() + 20);
  const deadlineArt = new Date(dateArt);
  deadlineArt.setDate(deadlineArt.getDate() - 1);

  const dateBiz = new Date();
  dateBiz.setDate(dateBiz.getDate() + 30);
  const deadlineBiz = new Date(dateBiz);
  deadlineBiz.setDate(deadlineBiz.getDate() - 1);

  const dateCyber = new Date();
  dateCyber.setDate(dateCyber.getDate() + 15);
  const deadlineCyber = new Date(dateCyber);
  deadlineCyber.setDate(deadlineCyber.getDate() - 1);

  const dateFood = new Date();
  dateFood.setDate(dateFood.getDate() + 75);
  const deadlineFood = new Date(dateFood);
  deadlineFood.setDate(deadlineFood.getDate() - 1);

  const dateMovie = new Date();
  dateMovie.setDate(dateMovie.getDate() + 10);
  const deadlineMovie = new Date(dateMovie);
  deadlineMovie.setDate(deadlineMovie.getDate() - 1);

  return [
    {
      title: 'Global AI & Developer Summit 2026',
      description: 'Join 500+ tech leaders, software engineers, and AI researchers for immersive sessions on Large Language Models, Cloud Native Architectures, Distributed Systems, and real-time live coding workshops.',
      category: 'Tech',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      location: 'Tech Convention Center, Auditorium 1, San Francisco CA',
      date: dateTech,
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      organizer: 'TechLabs Global Network',
      capacity: 300,
      registeredCount: 124,
      deadline: deadlineTech,
      status: 'Upcoming',
    },
    {
      title: 'Neon Horizon Indie Rock Festival',
      description: 'An exhilarating outdoor music extravaganza featuring top indie bands, acoustic solos, visual laser projections, immersive soundscapes, food pop-ups, and live merchandise booths across three stages.',
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      location: 'Vibe Amphitheater, Austin TX',
      date: dateMusic,
      startTime: '06:00 PM',
      endTime: '11:30 PM',
      organizer: 'Vibe Live Productions',
      capacity: 500,
      registeredCount: 280,
      deadline: deadlineMusic,
      status: 'Upcoming',
    },
    {
      title: 'Modern Abstract & Watercolor Masterclass',
      description: 'Unleash your creativity in a hands-on fine art workshop. Learn watercolor wash techniques, canvas composition, dynamic color theory, and acrylic blending directly from world-renowned artists.',
      category: 'Arts',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
      location: 'Chelsea Art Guild, Studio 4, New York NY',
      date: dateArt,
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      organizer: 'Creative Fine Arts Society',
      capacity: 40,
      registeredCount: 18,
      deadline: deadlineArt,
      status: 'Upcoming',
    },
    {
      title: 'Venture Capital & Startup Pitch Night',
      description: 'Watch 10 promising high-growth tech startups pitch live to top Angel Investors and Venture Capital funds. Features executive networking cocktails, founder panels, and Q&A sessions.',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      location: 'Innovators Hub 5th Floor, Boston MA',
      date: dateBiz,
      startTime: '05:30 PM',
      endTime: '09:00 PM',
      organizer: 'Silicon Alley Founders',
      capacity: 120,
      registeredCount: 95,
      deadline: deadlineBiz,
      status: 'Upcoming',
    },
    {
      title: 'Cybersecurity & Ethical Hacking Bootcamp',
      description: 'Master modern penetration testing, vulnerability assessment, cryptography, and defensive network security strategies in an intensive 1-day hands-on cyber workshop.',
      category: 'Tech',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      location: 'Cyber Security Center, Chicago IL',
      date: dateCyber,
      startTime: '09:00 AM',
      endTime: '04:00 PM',
      organizer: 'SecureNet Institute',
      capacity: 80,
      registeredCount: 42,
      deadline: deadlineCyber,
      status: 'Upcoming',
    },
    {
      title: 'International Culinary & Wine Expo',
      description: 'Taste gourmet dishes from Michelin-starred chefs, artisan cheese makers, and world-class wineries. Includes cooking demonstrations, wine pairing seminars, and tasting passes.',
      category: 'Other',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      location: 'Grand Bayfront Pavilion, Miami FL',
      date: dateFood,
      startTime: '12:00 PM',
      endTime: '08:00 PM',
      organizer: 'Global Culinary Association',
      capacity: 350,
      registeredCount: 190,
      deadline: deadlineFood,
      status: 'Upcoming',
    },
    {
      title: 'Mirzapur the Movie - Premiere Showcase',
      description: 'The world of Mirzapur comes to the big screen as old rivalries, shifting loyalties, and the relentless pursuit of power ignite a new chapter in the battle for the throne.',
      category: 'Other',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
      location: 'Avani Mall Multiplex, Screen 1',
      date: dateMovie,
      startTime: '02:00 PM',
      endTime: '06:00 PM',
      organizer: 'District Media',
      capacity: 100,
      registeredCount: 65,
      deadline: deadlineMovie,
      status: 'Upcoming',
    }
  ];
};

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
    let events = await Event.find(query).sort({ date: 1 });

    // Auto-seed if 0 events exist in database
    if (events.length === 0 && !search && (!category || category === 'All') && (!status || status === 'All')) {
      const totalCount = await Event.countDocuments();
      if (totalCount === 0) {
        const sampleData = getSampleEventsData();
        await Event.insertMany(sampleData);
        events = await Event.find(query).sort({ date: 1 });
      }
    }

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed events endpoint
// @route   GET or POST /api/events/seed
// @access  Public
const seedEvents = async (req, res) => {
  try {
    await Event.deleteMany({});
    const sampleData = getSampleEventsData();
    const inserted = await Event.insertMany(sampleData);
    res.json({
      success: true,
      message: `Successfully seeded ${inserted.length} high-quality events!`,
      count: inserted.length,
      data: inserted,
    });
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
      image: bodyImage,
    } = req.body;

    const image = req.file ? req.file.filename : bodyImage;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please upload a banner image or provide image URL' });
    }

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
      image,
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

    // Delete associated registrations
    await Registration.deleteMany({ eventId: req.params.id });

    // Delete banner image from disk if local
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
  seedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
