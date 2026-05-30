import React from 'react';
import { Calendar, CheckCircle, ShieldAlert, FileSpreadsheet, QrCode, Palette } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight dark:text-white sm:text-5xl">
            About SmartEvent
          </h1>
          <p className="mt-4 text-lg text-slate-550 dark:text-slate-400">
            A comprehensive, production-ready MERN Stack Event Management and Smart Ticketing system.
          </p>
        </div>

        {/* System Mission */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-700/50 mb-8">
          <h2 className="text-2xl font-bold dark:text-white mb-4">Our Mission</h2>
          <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-sm">
            SmartEvent simplifies the lifecycle of event management. By eliminating paper printouts and clunky registrations, our system offers a unified workspace: attendees easily discover and secure bookings via visual vector QR tickets, while administrative dashboard operators monitor capacity, verify check-ins in real-time, and analyze metrics on a single, high-fidelity platform.
          </p>
        </div>

        {/* User Role Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Attendee Flows */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-700/50">
            <h3 className="text-xl font-bold text-indigo-650 dark:text-indigo-400 mb-6 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>For Attendees</span>
            </h3>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">1</span>
                <span>Register a secure account and login anytime.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">2</span>
                <span>Browse, filter, and read details on scheduled events.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">3</span>
                <span>Register with automated capacity validation and instant QR ticket generation.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">4</span>
                <span>Print or download your ticket directly to PDF, check attendance logs, or cancel registrations.</span>
              </li>
            </ul>
          </div>

          {/* Admin flows */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-700/50">
            <h3 className="text-xl font-bold text-indigo-650 dark:text-indigo-400 mb-6 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5" />
              <span>For Administrators</span>
            </h3>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">1</span>
                <span>Full CRUD capabilities to add, edit details, or delete events with custom banners.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">2</span>
                <span>Audit comprehensive registration lists and search participants by name, email, or tickets.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">3</span>
                <span>Open the camera QR scanner or enter IDs to instantly check in guests.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-xs mt-0.5">4</span>
                <span>Export registered attendee lists to standard CSV reports for offline coordination.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technology Highlights */}
        <div className="bg-indigo-900/10 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/50 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 mb-6">Technical Architecture</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="mt-2 text-sm font-bold dark:text-white">Node / Express</p>
              <p className="text-xs text-slate-500">Robust REST APIs</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="mt-2 text-sm font-bold dark:text-white">QR Code Engine</p>
              <p className="text-xs text-slate-500">Instant generation</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <FileSpreadsheet className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="mt-2 text-sm font-bold dark:text-white">Recharts & CSV</p>
              <p className="text-xs text-slate-500">Dynamic exports</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="mt-2 text-sm font-bold dark:text-white">Tailwind CSS</p>
              <p className="text-xs text-slate-500">Aesthetics & Dark Mode</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="mt-2 text-sm font-bold dark:text-white">JWT / Bcrypt</p>
              <p className="text-xs text-slate-500">Strict crypted access</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="mt-2 text-sm font-bold dark:text-white">React Query</p>
              <p className="text-xs text-slate-500">Optimistic state sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
