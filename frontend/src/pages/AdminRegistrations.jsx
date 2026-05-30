import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, FileSpreadsheet, Loader, Calendar, User, Ticket, Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('All');
  const [exporting, setExporting] = useState(false);

  const statuses = ['All', 'Pending', 'Attended', 'Cancelled'];

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/registrations', {
        params: {
          search: search || undefined,
          attendanceStatus: attendanceStatus !== 'All' ? attendanceStatus : undefined,
        },
      });
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
    const delayDebounce = setTimeout(() => {
      fetchRegistrations();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, attendanceStatus]);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const response = await api.get('/admin/export', { responseType: 'blob' });
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registrations_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV list');
    } finally {
      setExporting(false);
    }
  };

  const handleManualCheckIn = async (ticketId) => {
    const confirmCheckIn = window.confirm(`Mark ticket ID ${ticketId} as checked-in?`);
    if (!confirmCheckIn) return;

    try {
      const response = await api.post('/admin/scan', { ticketId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchRegistrations(); // Reload
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Check-in failed';
      toast.error(msg);
    }
  };

  const handleCancelBooking = async (regId) => {
    const confirmCancel = window.confirm('Cancel this registration? This will release the seat slot.');
    if (!confirmCancel) return;

    try {
      const response = await api.delete(`/register/${regId}`);
      if (response.data.success) {
        toast.success('Registration cancelled successfully');
        fetchRegistrations();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Cancellation failed';
      toast.error(msg);
    }
  };

  const getAttendanceBadge = (status) => {
    switch (status) {
      case 'Attended':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'Pending':
        return 'bg-amber-100 text-amber-850 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-955/20 dark:text-red-400 dark:border-red-900/50'; // standard color
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setAttendanceStatus('All');
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
              <span>Registrations List</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Registrations Audit</h1>
          </div>
          
          <button
            onClick={handleExportCSV}
            disabled={exporting || registrations.length === 0}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-750 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm disabled:opacity-50 mt-4 sm:mt-0"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-500" />
            {exporting ? 'Exporting CSV...' : 'Export to CSV'}
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-700 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by participant name, email, ticket ID, or event..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Select */}
            <div className="w-full md:w-56">
              <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-205 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
              >
                {statuses.map((stat) => (
                  <option key={stat} value={stat}>
                    Status: {stat}
                  </option>
                ))}
              </select>
            </div>

            {(search || attendanceStatus !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-350 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Audit List Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : registrations.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Participant</th>
                    <th className="px-6 py-4">Event Title</th>
                    <th className="px-6 py-4">Registration Date</th>
                    <th className="px-6 py-4">Ticket ID</th>
                    <th className="px-6 py-4">Check-In Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-700/50 text-sm">
                  {registrations.map((reg) => {
                    const participant = reg.userId;
                    const event = reg.eventId;
                    if (!participant || !event) return null;

                    return (
                      <tr key={reg._id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${reg.attendanceStatus === 'Cancelled' ? 'opacity-50' : ''}`}>
                        {/* Participant info */}
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <img
                            src={participant.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${participant.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=4f46e5&color=fff`}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <strong className="text-slate-805 dark:text-white block leading-tight">{participant.name}</strong>
                            <span className="text-xs text-slate-400">{participant.email}</span>
                          </div>
                        </td>
                        {/* Event title */}
                        <td className="px-6 py-4">
                          <strong className="text-slate-800 dark:text-slate-200 block line-clamp-1 max-w-[200px]">{event.title}</strong>
                          <span className="text-xs text-slate-400">{new Date(event.date).toLocaleDateString()}</span>
                        </td>
                        {/* Registration date */}
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(reg.registrationDate).toLocaleDateString()}
                        </td>
                        {/* Ticket Number */}
                        <td className="px-6 py-4 text-xs font-mono font-bold tracking-wide text-indigo-650 dark:text-indigo-400">
                          {reg.ticketId}
                        </td>
                        {/* Checkin badge */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getAttendanceBadge(reg.attendanceStatus)}`}>
                            {reg.attendanceStatus}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          {reg.attendanceStatus === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleManualCheckIn(reg.ticketId)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-450 dark:hover:bg-emerald-950/20 rounded-lg transition-colors inline-flex items-center"
                                title="Mark Attended"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelBooking(reg._id)}
                                className="p-1.5 text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-colors inline-flex items-center"
                                title="Cancel Registration"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700">
            <Ticket className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold dark:text-white mt-4">No registrations audited</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">We couldn't find any registrations matching your parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegistrations;
