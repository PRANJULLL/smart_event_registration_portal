import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl tracking-tight mb-4">
              <Calendar className="w-6 h-6" />
              <span>SmartEvent</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Discover, register, and attend premium workshops, music concerts, tech conferences, and networking events. Elevate your event experience.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors">Browse Events</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>pranjularora456@gmail.com</li>
              <li>+91 - 9569500942</li>
              <li>Kanpur, Uttar Pradesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} SmartEvent Portal. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center md:justify-start mt-2 md:mt-0">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-current animate-pulse" />
            <span>by MERN Developers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
