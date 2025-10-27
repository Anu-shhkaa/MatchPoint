import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ArrowRightOnRectangleIcon, 
  CogIcon, 
  InformationCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';

const MorePage = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 text-blue-50 py-8 pb-20 md:pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            More <span className="text-blue-400">Options</span>
          </h1>
          <p className="text-blue-200/80 text-lg">
            Everything you need to know about MatchPoint VESIT
          </p>
        </div>

        {/* Admin Section */}
        <div className="mb-8">
          {token ? (
            <Link 
              to="/admin/dashboard" 
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl p-6 shadow-xl border border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">Admin Dashboard</h3>
                    <p className="text-blue-100/80 text-sm">Manage events, matches, and scores</p>
                  </div>
                </div>
                <CogIcon className="h-6 w-6 text-white transform group-hover:rotate-90 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link 
              to="/admin/login" 
              className="group bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl p-6 shadow-lg border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105 block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <ArrowRightOnRectangleIcon className="h-7 w-7 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">Admin Access</h3>
                    <p className="text-blue-200/70 text-sm">Login to manage the platform</p>
                  </div>
                </div>
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-blue-400 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>

        {/* About Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* About MatchPoint */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-blue-800/20 p-6 hover:border-blue-600/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <InformationCircleIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">About MatchPoint</h2>
            </div>
            <p className="text-blue-200/80 leading-relaxed mb-4">
              MatchPoint is the official sports management platform for VESIT, Navi Mumbai. 
              Follow live scores, check event schedules, and view points tables for all college 
              sports events including <span className="text-blue-300 font-semibold">Sphurti</span>, 
              <span className="text-blue-300 font-semibold"> VPL</span>, and 
              <span className="text-blue-300 font-semibold"> VCL</span>.
            </p>
            <div className="flex items-center gap-2 text-blue-300/70 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live scores and real-time updates
            </div>
          </div>

          {/* About VESIT */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-blue-800/20 p-6 hover:border-blue-600/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">About VESIT</h2>
            </div>
            <p className="text-blue-200/80 leading-relaxed">
              Vivekanand Education Society's Institute of Technology (VESIT) is a premier 
              engineering college in Navi Mumbai, known for academic excellence and vibrant 
              sports culture. The institute fosters holistic development through various 
              technical and sports activities.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-blue-800/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Contact Sports Council</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-800/50 rounded-lg flex items-center justify-center">
                <EnvelopeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Email</h3>
                <p className="text-blue-200/80">sports@ves.ac.in</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-800/50 rounded-lg flex items-center justify-center">
                <PhoneIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Phone</h3>
                <p className="text-blue-200/80">+91 22 61532500</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-800/50 rounded-lg flex items-center justify-center">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Address</h3>
                <p className="text-blue-200/80">VESIT, Hashu Advani Complex, Chembur, Mumbai</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-700/30">
            <Link 
              to="/contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <EnvelopeIcon className="h-5 w-5" />
              Contact Sports Council
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-blue-800/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/events" 
              className="p-4 bg-blue-900/30 rounded-xl border border-blue-700/30 hover:border-blue-500/50 hover:bg-blue-800/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-white">All Events</span>
              </div>
            </Link>
            
            <Link 
              to="/matches/live" 
              className="p-4 bg-blue-900/30 rounded-xl border border-blue-700/30 hover:border-blue-500/50 hover:bg-blue-800/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <PlayIcon className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-white">Live Matches</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 pt-6 border-t border-blue-800/30">
          <p className="text-blue-300/60 text-sm">
            © 2024 MatchPoint VESIT. Built for the sports community.
          </p>
        </div>
      </div>
    </div>
  );
};

// Add missing icons
const CalendarDaysIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

export default MorePage;