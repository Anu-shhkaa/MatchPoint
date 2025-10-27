import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilSquareIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const AdminEventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching events...');
      
      const res = await api.get('/events');
      console.log('📦 Full API response:', res);
      console.log('📦 Response data:', res.data);
      
      // Handle different response formats
      let eventsData = [];
      
      if (Array.isArray(res.data)) {
        // If response.data is directly an array
        eventsData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        // If response.data has a data property that's an array
        eventsData = res.data.data;
      } else if (res.data && res.data.success) {
        // If it's a success object with data array
        eventsData = res.data.data || [];
      }
      
      console.log('🎯 Extracted events:', eventsData);
      setEvents(eventsData);
      
    } catch (err) {
      console.error("❌ Failed to fetch events", err);
      console.error("Error details:", err.response?.data);
      setError('Failed to load events. Please check the console for details.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Events</h1>
          <div className="h-10 w-40 bg-blue-800/30 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-blue-800/30 animate-pulse">
              <div className="h-6 bg-blue-800/30 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-blue-800/30 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Events</h1>
          <Link
            to="/admin/events/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Event
          </Link>
        </div>
        <div className="bg-red-900/20 backdrop-blur-sm p-6 rounded-xl border border-red-800/30 text-center">
          <div className="text-red-400 text-lg font-medium mb-2">Error Loading Events</div>
          <p className="text-red-300/70 text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Events</h1>
          <p className="text-blue-200/70">
            Create and manage sports events, tournaments, and competitions
          </p>
        </div>
        <Link
          to="/admin/events/create"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Event
        </Link>
      </div>

      {/* Events List */}
      <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 backdrop-blur-sm rounded-xl border border-blue-800/30 shadow-lg">
        <div className="p-6">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map(event => (
                <div 
                  key={event._id} 
                  className="flex justify-between items-center p-6 rounded-xl bg-blue-800/20 border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {event.name}
                      </h2>
                      {event.eventType && (
                        <span className="bg-blue-600/30 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/50">
                          {event.eventType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-200/80">
                      <span className="flex items-center gap-1">
                        <TrophyIcon className="h-4 w-4" />
                        {event.sports?.length || 0} Sports
                      </span>
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="h-4 w-4" />
                        {event.teams?.length || 0} Teams
                      </span>
                      {event.startDate && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-blue-300/70 text-sm mt-2 line-clamp-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/admin/events/${event._id}`}
                    className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-blue-200 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-slate-600/30 hover:border-slate-500/50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Manage
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDaysIcon className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Events Yet</h3>
              <p className="text-blue-200/70 mb-6 max-w-md mx-auto">
                Get started by creating your first sports event. Set up teams, sports, and pointing systems.
              </p>
              <Link
                to="/admin/events/create"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {events.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-800/20 backdrop-blur-sm p-4 rounded-xl border border-blue-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">{events.length}</div>
            <div className="text-blue-300/70 text-sm">Total Events</div>
          </div>
          <div className="bg-blue-800/20 backdrop-blur-sm p-4 rounded-xl border border-blue-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {events.reduce((total, event) => total + (event.sports?.length || 0), 0)}
            </div>
            <div className="text-blue-300/70 text-sm">Total Sports</div>
          </div>
          <div className="bg-blue-800/20 backdrop-blur-sm p-4 rounded-xl border border-blue-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {events.reduce((total, event) => total + (event.teams?.length || 0), 0)}
            </div>
            <div className="text-blue-300/70 text-sm">Total Teams</div>
          </div>
          <div className="bg-blue-800/20 backdrop-blur-sm p-4 rounded-xl border border-blue-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {events.filter(event => new Date(event.startDate) > new Date()).length}
            </div>
            <div className="text-blue-300/70 text-sm">Upcoming Events</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Additional Icons
const TrophyIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
  </svg>
);

const UserGroupIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
  </svg>
);

const CalendarDaysIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
  </svg>
);

export default AdminEventListPage;