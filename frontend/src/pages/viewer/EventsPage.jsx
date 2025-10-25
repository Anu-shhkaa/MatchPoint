import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service'; // Make sure this path is correct
import { Link } from 'react-router-dom';
import EventCard from '../../components/viewer/EventCard'; // Reuse the EventCard component

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch all events from your backend API
        const res = await api.get('/api/events');
        setEvents(Array.isArray(res.data) ? res.data : []);
        // setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
        setError('Could not load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []); // Empty dependency array means run once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {/* You can replace this with your Spinner component */}
        <p className="text-lg">Loading Events...</p>
      </div>
    );
  }

  if (error) {
     return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
        All Events
      </h1>

      {events.length === 0 && !loading && (
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          No events have been created yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(events) && events.length > 0 && (
          events.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;

