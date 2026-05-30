import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Ticket, CheckCircle, AlertTriangle, Printer, Trash2, ShieldAlert, Loader, Info, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/register/user');
      if (response.data.success) {
        setRegistrations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (regId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this event registration?');
    if (!confirmCancel) return;

    try {
      const response = await api.delete(`/register/${regId}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Registration cancelled successfully');
        fetchRegistrations();
        if (activeTicket?._id === regId) {
          setActiveTicket(null);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to cancel registration';
      toast.error(msg);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getAttendanceBadge = (status) => {
    switch (status) {
      case 'Attended':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'Pending':
        return 'bg-amber-100 text-amber-850 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">My Registrations</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">View your active bookings, download attendance QR passes, and audit check-ins.</p>
        </div>

        {/* Registrations List */}
        {registrations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List Table/Cards */}
            <div className="lg:col-span-2 space-y-4">
              {registrations.map((reg) => {
                const event = reg.eventId;
                if (!event) return null;

                const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                const isCancelled = reg.attendanceStatus === 'Cancelled';
                const isAttended = reg.attendanceStatus === 'Attended';
                const isEventCompleted = event.status === 'Completed';

                return (
                  <div
                    key={reg._id}
                    className={`flex flex-col md:flex-row items-stretch md:items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border transition-all ${
                      activeTicket?._id === reg._id
                        ? 'border-indigo-500 shadow-indigo-100 dark:shadow-none ring-1 ring-indigo-500'
                        : 'border-slate-150 dark:border-slate-700/50 hover:shadow-sm'
                    } ${isCancelled ? 'opacity-65' : ''}`}
                  >
                    {/* Info text */}
                    <div className="flex-1 space-y-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getAttendanceBadge(reg.attendanceStatus)}`}>
                          {reg.attendanceStatus}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {reg.ticketId}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-850 dark:text-white line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                        <span>{formattedDate} • {event.startTime} - {event.endTime}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location: {event.location}</p>
                    </div>

                    {/* Actions panel */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                      {!isCancelled && (
                        <button
                          onClick={() => setActiveTicket(reg)}
                          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center"
                        >
                          <Ticket className="w-3.5 h-3.5 mr-1.5" />
                          View Ticket
                        </button>
                      )}

                      {!isCancelled && !isAttended && !isEventCompleted && (
                        <button
                          onClick={() => handleCancelRegistration(reg._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-all"
                          title="Cancel Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ticket Preview Panel */}
            <div className="lg:col-span-1">
              {activeTicket ? (
                <div className="sticky top-24 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700/50 shadow-md flex flex-col items-center text-center">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Attendance Pass</p>
                  <h4 className="font-extrabold text-slate-850 dark:text-white text-base line-clamp-2 max-w-xs">{activeTicket.eventId?.title}</h4>

                  {/* QR Image */}
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 my-5">
                    <img
                      src={activeTicket.qrCode}
                      alt="Ticket QR Code"
                      className="w-44 h-44"
                    />
                  </div>

                  {/* Metadata fields */}
                  <div className="w-full space-y-2 border-t border-b border-slate-100 dark:border-slate-700 py-4 mb-5 text-left text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Ticket Number:</span>
                      <strong className="font-mono text-slate-700 dark:text-slate-200">{activeTicket.ticketId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{new Date(activeTicket.eventId?.date).toLocaleDateString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{activeTicket.eventId?.startTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <strong className="text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{activeTicket.eventId?.location}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{activeTicket.attendanceStatus}</strong>
                    </div>
                  </div>

                  <div className="w-full flex gap-3">
                    <button
                      onClick={handlePrint}
                      className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 transition-colors"
                    >
                      <Printer className="w-4 h-4 mr-1.5" />
                      Print Ticket (PDF)
                    </button>
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sticky top-24 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-80">
                  <Ticket className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-655" />
                  <p className="text-sm font-semibold">Select a ticket from the list to display details, print, or download PDF.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-150 dark:border-slate-700 max-w-md mx-auto">
            <Ticket className="w-16 h-16 text-slate-350 dark:text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold dark:text-white mt-4 font-sans">No bookings found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xs mx-auto">
              You haven't registered for any events yet. Check out our latest schedules!
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* Special Print View Component rendered off-screen but visible to the printer */}
      {activeTicket && (
        <div id="printable-ticket" className="hidden print:block bg-white text-black p-8 max-w-lg mx-auto border-2 border-slate-300 rounded-xl space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-indigo-900">SmartEvent Ticket Pass</h2>
            <p className="text-xs text-slate-500">Scan this QR code at the entrance check-in counter</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Event Title</p>
                <p className="text-base font-bold">{activeTicket.eventId?.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Attendee Name</p>
                <p className="text-base font-bold">Attendee</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Date</p>
                <p className="text-sm font-bold">{new Date(activeTicket.eventId?.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Time</p>
                <p className="text-sm font-bold">{activeTicket.eventId?.startTime}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Location</p>
                <p className="text-sm font-bold truncate">{activeTicket.eventId?.location}</p>
              </div>
            </div>
            <div className="flex flex-col items-center pt-6 border-t border-slate-200">
              <img src={activeTicket.qrCode} alt="Ticket QR" className="w-56 h-56 border border-slate-300 rounded-lg" />
              <p className="mt-2 text-sm font-mono tracking-wider font-bold">Ticket ID: {activeTicket.ticketId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
