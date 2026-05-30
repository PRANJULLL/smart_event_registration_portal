require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-event-portal';
    console.log(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected!');

    // Clear existing collections
    console.log('Cleaning existing records...');
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    console.log('Database cleared.');

    // Seed Users
    console.log('Seeding users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@smartevent.com',
      password: 'admin123', // Schema hashes this on save
      role: 'admin',
    });

    const standardUser = await User.create({
      name: 'Jane Doe',
      email: 'user@smartevent.com',
      password: 'user123', // Schema hashes this on save
      role: 'user',
    });
    
    console.log(`Users seeded!`);
    console.log(`  Admin account: admin@smartevent.com / admin123`);
    console.log(`  User account: user@smartevent.com / user123`);

    // Seed Events
    console.log('Seeding events...');
    
    // Future dates
    const dateTech = new Date();
    dateTech.setDate(dateTech.getDate() + 45); // 45 days in future

    const deadlineTech = new Date(dateTech);
    deadlineTech.setDate(deadlineTech.getDate() - 1); // 1 day before event
    deadlineTech.setHours(23, 59, 0);

    const dateMusic = new Date();
    dateMusic.setDate(dateMusic.getDate() + 90);

    const deadlineMusic = new Date(dateMusic);
    deadlineMusic.setDate(deadlineMusic.getDate() - 1);
    deadlineMusic.setHours(23, 59, 0);

    const dateArt = new Date();
    dateArt.setDate(dateArt.getDate() + 15);

    const deadlineArt = new Date(dateArt);
    deadlineArt.setDate(deadlineArt.getDate() - 1);
    deadlineArt.setHours(23, 59, 0);

    const eventsList = [
      {
        title: 'Global Developer Summit 2026',
        description: 'Join 500+ developers worldwide for deep dives into AI/ML, advanced Web development architectures, system performance scales, and live interactive coding panels led by industry experts. Networking food drinks and exclusive swag packages included.',
        category: 'Tech',
        image: 'event-tech.png',
        location: 'Silicon Hall 4, Convention Center, San Francisco CA',
        date: dateTech,
        startTime: '09:00',
        endTime: '17:00',
        organizer: 'TechLabs Global Network',
        capacity: 150,
        registeredCount: 0,
        deadline: deadlineTech,
        status: 'Upcoming',
      },
      {
        title: 'Rock the Stage Live Concert',
        description: 'An electric night of alternative indie rock bands and live stages. Experience high-end audio setups, visual mapping projections, food truck alleys, and visual artist pop-ups in a massive open stadium hall layout.',
        category: 'Music',
        image: 'event-music.png',
        location: 'Vibe Stadium, Austin TX',
        date: dateMusic,
        startTime: '18:00',
        endTime: '23:00',
        organizer: 'Vibe Music Network',
        capacity: 250,
        registeredCount: 0,
        deadline: deadlineMusic,
        status: 'Upcoming',
      },
      {
        title: 'Creative Art Watercolor Workshop',
        description: 'A hands-on visual arts painting workshop. Learn from award-winning canvas artists: master color wash dynamics, gradients, canvas preps, and structural sketches. All canvas and brush materials provided on-site.',
        category: 'Arts',
        image: 'event-art.png',
        location: 'Studio Room 3, Chelsea Arts District, New York NY',
        date: dateArt,
        startTime: '11:00',
        endTime: '14:00',
        organizer: 'Creative Art Guild',
        capacity: 35,
        registeredCount: 0,
        deadline: deadlineArt,
        status: 'Upcoming',
      },
    ];

    const seededEvents = await Event.insertMany(eventsList);
    console.log(`Seeded ${seededEvents.length} events successfully.`);

    console.log('Seeding process complete! Closing connection.');
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
};

seedData();
