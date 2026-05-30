import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { Calendar, Shield, Cpu, Compass, Users, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        if (response.data.success) {
          // Take top 3 upcoming/ongoing events
          const filtered = response.data.data
            .filter(e => e.status !== 'Completed')
            .slice(0, 3);
          setFeaturedEvents(filtered);
        }
      } catch (error) {
        console.error('Error fetching featured events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide uppercase border border-indigo-500/35 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover What's Next</span>
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            The Smart Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Registration Portal</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover events, secure tickets instantly via unique QR codes, manage your bookings in real-time, and check in seamlessly at the venue.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-650 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-550/30 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-slate-700 hover:border-slate-500 text-base font-bold rounded-xl text-slate-350 bg-slate-800/40 hover:bg-slate-800/80 transition-all duration-200"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Dashboard cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-150 dark:border-slate-700">
          <div className="flex items-center p-4 space-x-4 border-r border-slate-100 dark:border-slate-750 last:border-0">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
              <Compass className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">100+</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Live Events</p>
            </div>
          </div>
          <div className="flex items-center p-4 space-x-4 border-r border-slate-100 dark:border-slate-750 last:border-0">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
              <Users className="w-8 h-8 text-emerald-650 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">10k+</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Happy Participants</p>
            </div>
          </div>
          <div className="flex items-center p-4 space-x-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-950/40 rounded-xl">
              <Shield className="w-8 h-8 text-pink-650 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">100%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Verified QR Tickets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight dark:text-white">Featured Events</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Check out the most popular and highly anticipated events coming up soon.</p>
          </div>
          <Link
            to="/events"
            className="group inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-4 md:mt-0"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700 h-96 animate-pulse"></div>
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 border border-dashed border-slate-350 dark:border-slate-700 rounded-2xl">
            <Calendar className="w-12 h-12 text-slate-455 mx-auto" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold">No featured events available right now.</p>
            <Link
              to="/events"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600"
            >
              Browse List
            </Link>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-white dark:bg-slate-900/50 py-20 border-t border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold dark:text-white">Seamless Ticketing & Attendance</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
              Our advanced technology makes registering and managing events painless for both organizers and attendees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-150 dark:border-slate-700">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-650 dark:text-indigo-400 rounded-xl w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mt-6">Instant QR Ticket Generation</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Immediately on registering, receive a cryptographically unique ticket with a scanable QR code in your dashboard.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-150 dark:border-slate-700">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-905 text-emerald-650 dark:text-emerald-455 rounded-xl w-fit">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mt-6">Secure JWT Protection</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Your data, password, and profiles are secured using standard JSON Web Tokenization and bcrypt password cryptography.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-150 dark:border-slate-700">
              <div className="p-3 bg-pink-100 dark:bg-pink-905 text-pink-650 dark:text-pink-400 rounded-xl w-fit">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mt-6">Admin Analytics & Checks</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Organizers get detailed charts, real-time ticket scanning, user attendance confirmations, and CSV participant reporting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
