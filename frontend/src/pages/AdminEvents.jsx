import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Edit2, Trash2, Calendar, MapPin, Loader, X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null); // If null, we are creating

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [capacity, setCapacity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin events:', error);
      toast.error('Failed to load events list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setCategory('Tech');
    setLocation('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setOrganizer('');
    setCapacity('');
    setDeadline('');
    setStatus('Upcoming');
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEventId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setLocation(event.location);
    // Format date string to YYYY-MM-DD for input field
    const formattedDate = new Date(event.date).toISOString().split('T')[0];
    setDate(formattedDate);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setOrganizer(event.organizer);
    setCapacity(event.capacity);
    // Format deadline string to YYYY-MM-DDTHH:MM for datetime-local input
    const formattedDeadline = new Date(event.deadline).toISOString().substring(0, 16);
    setDeadline(formattedDeadline);
    setStatus(event.status);
    setImageFile(null);
    setImagePreview(`${import.meta.env.VITE_IMAGE_BASE_URL}/${event.image}`);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm('WARNING: Deleting this event will automatically delete all participant registrations associated with it. Proceed?');
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/events/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete event';
      toast.error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !location || !date || !startTime || !endTime || !organizer || !capacity || !deadline) {
      return toast.error('Please enter all required fields');
    }

    if (!editingEventId && !imageFile) {
      return toast.error('Please upload a banner image for the event');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('organizer', organizer);
    formData.append('capacity', capacity);
    formData.append('deadline', deadline);
    formData.append('status', status);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      setSubmitting(true);
      let response;
      if (editingEventId) {
        response = await api.put(`/events/${editingEventId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        toast.success(editingEventId ? 'Event updated successfully' : 'Event created successfully');
        setModalOpen(false);
        fetchEvents();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Submission failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-indigo-650 dark:text-indigo-400 mb-1">
              <Link to="/admin" className="hover:underline">Admin Dashboard</Link>
              <span>/</span>
              <span>Events Manager</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Events Manager</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>

        {/* Events Table/List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Banner / Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Booked</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-700/50 text-sm">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      {/* Image + Title */}
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${event.image}`}
                          alt={event.title}
                          className="w-12 h-8 object-cover rounded-lg bg-slate-100 dark:bg-slate-900"
                        />
                        <strong className="text-slate-800 dark:text-white line-clamp-1 max-w-[200px]">{event.title}</strong>
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                          {event.category}
                        </span>
                      </td>
                      {/* Location */}
                      <td className="px-6 py-4 truncate max-w-[150px]">{event.location}</td>
                      {/* Date */}
                      <td className="px-6 py-4 text-xs">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      {/* Booked / Capacity */}
                      <td className="px-6 py-4 text-xs font-medium">
                        {event.registeredCount} / {event.capacity}
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          event.status === 'Ongoing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30 rounded-lg transition-colors inline-block"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="p-1.5 text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-lg transition-colors inline-block"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold dark:text-white mt-4">No events created</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Create your first event by clicking the "Create Event" button above.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl p-6 rounded-3xl shadow-2xl border border-slate-150 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-6">
              <h2 className="text-xl font-extrabold dark:text-white">
                {editingEventId ? 'Edit Event Details' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Developer Summit 2026"
                  />
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Organizer Name *</label>
                  <input
                    type="text"
                    required
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. TechLabs Global"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Arts">Arts</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Hall 4, Convention Center, San Francisco"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Event Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 14:00 or 2:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 18:00 or 6:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Max Capacity *</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 150"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Registration Deadline *</label>
                  <input
                    type="datetime-local"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Event Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter comprehensive details about event sessions, itineraries, speaker outlines..."
                  />
                </div>

                {/* Banner Image Upload */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Event Banner Image *</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded-lg border border-slate-205 dark:border-slate-700 bg-slate-100"
                      />
                    )}
                    <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-4 cursor-pointer hover:bg-indigo-50/20 transition-all text-center">
                      <Upload className="w-5 h-5 text-indigo-500 mb-1" />
                      <span className="text-xs font-semibold text-slate-650 dark:text-slate-400">Choose Image or drop file</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, JPEG, GIF. Max 5MB.</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-755 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {submitting ? 'Submitting Details...' : editingEventId ? 'Save Event Changes' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
