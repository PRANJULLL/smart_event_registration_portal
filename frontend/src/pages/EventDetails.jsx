import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { Calendar, MapPin, Users, User, ArrowLeft, Clock, CalendarRange, Check, AlertCircle, Loader, Ticket } from 'lucide-react';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      // Fetch Event
      const response = await api.get(`/events/${id}`);
      if (response.data.success) {
        setEvent(response.data.data);
      }

      // If user is logged in, check if they are registered for this event
      if (isAuthenticated) {
        const regResponse = await api.get('/register/user');
        if (regResponse.data.success) {
          const match = regResponse.data.data.find((reg) => reg.eventId?._id === id && reg.attendanceStatus !== 'Cancelled');
          if (match) {
            setIsRegistered(true);
            setUserRegistration(match);
          } else {
            setIsRegistered(false);
            setUserRegistration(null);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to register for this event');
      return navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
    }

    try {
      setRegistering(true);
      const response = await api.post('/register', { eventId: id });
      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful!');
        setIsRegistered(true);
        setUserRegistration(response.data.data);
        setShowSuccessModal(true);
        // Refresh event details to increment registeredCount
        const eventRes = await api.get(`/events/${id}`);
        if (eventRes.data.success) {
          setEvent(eventRes.data.data);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to register';
      toast.error(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold dark:text-white mt-4">Event Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">The event you are looking for does not exist or has been deleted.</p>
          <Link
            to="/events"
            className="mt-6 inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    image,
    location,
    date,
    startTime,
    endTime,
    capacity,
    registeredCount,
    deadline,
    status,
    organizer,
  } = event;

  const isFull = registeredCount >= capacity;
  const isDeadlinePassed = new Date() > new Date(deadline);
  const isCompleted = status === 'Completed';

  // Format Dates
  const eventDateStr = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const deadlineDateStr = new Date(deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/events" className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-650 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Directory</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main details body */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Banner Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-950">
              <img
                src={image ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${image}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'}
                alt={title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-indigo-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                {category}
              </span>
            </div>

            {/* Title / Description */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-150 dark:border-slate-700/50 space-y-4">
              <h1 className="text-3xl font-extrabold dark:text-white leading-tight">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4 text-indigo-500" />
                  <span>Hosted by <strong>{organizer}</strong></span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:inline"></span>
                <span className="flex items-center space-x-1">
                  <Ticket className="w-4 h-4 text-indigo-500" />
                  <span>Status: <strong className="text-indigo-600 dark:text-indigo-400">{status}</strong></span>
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-bold dark:text-white mb-3">About this Event</h3>
                <p className="text-slate-600 dark:text-white leading-relaxed text-sm whitespace-pre-line">{description}</p>
              </div>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            
            {/* Action Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-md border border-slate-150 dark:border-slate-700/50 space-y-6">
              
              <h3 className="text-lg font-bold dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">Event Details</h3>

              {/* Date Block */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-indigo-55/20 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 rounded-xl mt-0.5">
                  <CalendarRange className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</p>
                  <p className="text-sm font-bold dark:text-white mt-0.5">{eventDateStr}</p>
                </div>
              </div>

              {/* Time Block */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-indigo-55/20 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 rounded-xl mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Time</p>
                  <p className="text-sm font-bold dark:text-white mt-0.5">{startTime} - {endTime}</p>
                </div>
              </div>

              {/* Location Block */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-indigo-55/20 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 rounded-xl mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-bold dark:text-white mt-0.5">{location}</p>
                </div>
              </div>

              {/* Capacity Block */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-indigo-55/20 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 rounded-xl mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Availability</p>
                  <p className="text-sm font-bold dark:text-white mt-0.5">{registeredCount} / {capacity} Registered</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-indigo-600 h-full"
                      style={{ width: `${Math.min((registeredCount / capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Deadline Block */}
              <div className="flex items-start space-x-4 text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-750">
                <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-500 dark:text-slate-400">Registration Deadline</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{deadlineDateStr}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900">
                      <Check className="w-5 h-5 mr-2" />
                      Registered
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow transition-colors"
                    >
                      View Ticket
                    </Link>
                  </div>
                ) : isCompleted ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    Event Completed
                  </button>
                ) : isDeadlinePassed ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    Registration Closed
                  </button>
                ) : isFull ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50 cursor-not-allowed"
                  >
                    Fully Booked
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 transition-all duration-200"
                  >
                    {registering ? 'Processing Booking...' : 'Register Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && userRegistration && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl border border-slate-150 dark:border-slate-700 text-center animate-in fade-in zoom-in duration-300">
            
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold dark:text-white">Registration Confirmed!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              You are officially registered. Below is your unique attendance ticket.
            </p>

            {/* Ticket Card render inside modal */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-750 my-6 space-y-4">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Attendance Pass</p>
              <h4 className="font-extrabold text-slate-800 dark:text-white line-clamp-1">{title}</h4>
              
              <div className="flex justify-center py-2">
                <img
                  src={userRegistration.qrCode}
                  alt="QR Code Ticket"
                  className="w-48 h-48 border-4 border-white dark:border-slate-800 rounded-lg shadow-sm"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p>Attendee: <strong>{user?.name}</strong></p>
                <p>Ticket ID: <span className="font-mono text-slate-700 dark:text-slate-300">{userRegistration.ticketId}</span></p>
                <p>Date: {new Date(date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-750 transition-colors shadow-sm"
              >
                Go to My Dashboard
              </Link>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-350 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
