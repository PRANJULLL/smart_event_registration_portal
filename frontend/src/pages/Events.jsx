import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { Search, SlidersHorizontal, Calendar, X, RefreshCw } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  // Categories list
  const categories = ['All', 'Tech', 'Music', 'Arts', 'Business', 'Other'];
  // Statuses list
  const statuses = ['All', 'Upcoming', 'Ongoing', 'Completed'];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events', {
        params: {
          search: search || undefined,
          category: category !== 'All' ? category : undefined,
          status: status !== 'All' ? status : undefined,
        },
      });
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch events. Simple debounce can be implemented, but let's fetch on filter/search change
    const delayDebounce = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category, status]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">Browse Events</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Discover workshops, talk sessions, meetups and book your slot instantly.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-700 mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="w-full lg:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div className="w-full lg:w-48">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
              >
                {statuses.map((stat) => (
                  <option key={stat} value={stat}>
                    Status: {stat}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {(search || category !== 'All' || status !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-slate-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700/50 h-[380px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-700 max-w-2xl mx-auto">
            <Calendar className="w-16 h-16 text-slate-350 dark:text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold dark:text-white mt-4">No events found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              We couldn't find any events matching your search criteria. Try adjusting your filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-750 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
