import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    category,
    image,
    location,
    date,
    startTime,
    endTime,
    capacity,
    registeredCount,
    status,
  } = event;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getImageUrl = () => {
    if (image) {
      return `${import.meta.env.VITE_IMAGE_BASE_URL}/${image}`;
    }
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80';
  };

  // Dynamic colors for tags
  const getCategoryColor = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('tech') || c.includes('code')) return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
    if (c.includes('music') || c.includes('concert')) return 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-850';
    if (c.includes('art') || c.includes('design')) return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
    if (c.includes('business') || c.includes('meetup')) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
    return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800';
  };

  const getStatusColor = (stat) => {
    switch (stat) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Ongoing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse';
      case 'Completed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-850';
    }
  };

  const isFull = registeredCount >= capacity;
  const capacityPercent = Math.min(Math.round((registeredCount / capacity) * 100), 100);

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl border border-slate-150 dark:border-slate-700/50 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      {/* Banner Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={getImageUrl()}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(status)}`}>
          {status}
        </span>
        {/* Category Badge */}
        <span className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm ${getCategoryColor(category)}`}>
          {category}
        </span>
      </div>

      {/* Info Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>{formattedDate} • {startTime} - {endTime}</span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span className="truncate">{location}</span>
        </div>

        {/* Space Spacer */}
        <div className="flex-grow mt-4"></div>

        {/* Capacity Progress */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Capacity</span>
            </span>
            <span>{registeredCount} / {capacity} registered</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-550' : 'bg-indigo-600 dark:bg-indigo-455'}`}
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>
        </div>

        {/* CTA Link */}
        <div className="mt-5">
          <Link
            to={`/events/${_id}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-sm transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
