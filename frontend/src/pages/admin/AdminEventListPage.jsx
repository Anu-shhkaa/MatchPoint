import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilSquareIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const AdminEventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link
          to="/admin/events/create"
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Event
        </Link>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark shadow-md rounded-lg">
        <div className="space-y-4 p-4">
          {events.length > 0 ? (
            events.map(event => (
              <div 
                key={event._id} 
                className="flex justify-between items-center p-4 rounded bg-gray-100 dark:bg-gray-800 shadow"
              >
                <div>
                  <h2 className="text-xl font-bold">{event.name}</h2>
                  <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    {event.eventType} | {event.sports.length} Sports | {event.teams.length} Teams
                  </span>
                </div>
                <Link
                  to={`/admin/events/${event._id}`} // Links to AdminEventDetailPage
                  className="btn-secondary flex items-center gap-2"
                >
                  Manage
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            ))
          ) : (
            <p>No events created yet. <Link to="/admin/events/create" className="text-primary-DEFAULT">Create one!</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventListPage;
