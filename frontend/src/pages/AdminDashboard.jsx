import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Users, Ticket, Bell, LayoutGrid, BarChart2, ListChecks, QrCode, Loader, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { toast } from 'react-toastify';

const COLORS = ['#4f46e5', '#10b981', '#ec4899', '#f59e0b', '#3b82f6', '#8b5cf6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading administration stats...</p>
        </div>
      </div>
    );
  }

  const { cards, registrationsPerEvent, categoryStats, monthlyRegistrations } = stats || {};

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Admin Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Admin Console</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Manage schedules, bookings, and audit registration logs.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link
              to="/admin/events"
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"
            >
              <LayoutGrid className="w-4 h-4 mr-2 text-indigo-500" />
              Events Manager
            </Link>
            <Link
              to="/admin/registrations"
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"
            >
              <ListChecks className="w-4 h-4 mr-2 text-indigo-500" />
              Registrations List
            </Link>
            <Link
              to="/admin/scan"
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code Scanner
            </Link>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-750/50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Total Events</p>
              <h3 className="text-3xl font-extrabold dark:text-white">{cards?.totalEvents || 0}</h3>
            </div>
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-750/50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Total Participants</p>
              <h3 className="text-3xl font-extrabold dark:text-white">{cards?.totalParticipants || 0}</h3>
            </div>
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-450 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-755/50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Total Registrations</p>
              <h3 className="text-3xl font-extrabold dark:text-white">{cards?.totalRegistrations || 0}</h3>
            </div>
            <div className="p-3.5 bg-pink-50 dark:bg-pink-955/20 text-pink-650 dark:text-pink-400 rounded-2xl">
              <Ticket className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-750/50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Upcoming Events</p>
              <h3 className="text-3xl font-extrabold dark:text-white">{cards?.upcomingEvents || 0}</h3>
            </div>
            <div className="p-3.5 bg-amber-50 dark:bg-amber-955/20 text-amber-650 dark:text-amber-400 rounded-2xl">
              <Bell className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart: Registrations per event (Bar) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-700/50 shadow-sm lg:col-span-2">
            <h3 className="text-base font-extrabold dark:text-white mb-6 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-indigo-500" />
              <span>Registrations Per Event (Top 10)</span>
            </h3>
            <div className="h-80">
              {registrationsPerEvent?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationsPerEvent} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="registrations" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No chart data available</div>
              )}
            </div>
          </div>

          {/* Side Chart: Category Aggregation (Pie) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-700/50 shadow-sm lg:col-span-1">
            <h3 className="text-base font-extrabold dark:text-white mb-6">Event Category Share</h3>
            <div className="h-80 flex items-center justify-center">
              {categoryStats?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-455">No categories booked</div>
              )}
            </div>
          </div>

          {/* Lower Chart: Monthly Registration Growth (Area) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-150 dark:border-slate-700/50 shadow-sm lg:col-span-3">
            <h3 className="text-base font-extrabold dark:text-white mb-6">Monthly Bookings Trend</h3>
            <div className="h-80">
              {monthlyRegistrations?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorReg)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No monthly data available</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
