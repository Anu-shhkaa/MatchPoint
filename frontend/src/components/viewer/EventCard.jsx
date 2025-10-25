import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link 
      to={`/events/${event._id}`} 
      className="block shadow-lg rounded-lg overflow-hidden bg-surface-light dark:bg-surface-dark hover:shadow-xl transition-shadow duration-300"
    >
      {/* You can add event.posterImage here later */}
      <div className="h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
        {/* Placeholder for an image */}
        <span className="text-gray-500 text-lg font-bold">{event.name}</span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold truncate">{event.name}</h3>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{event.eventType}</p>
      </div>
    </Link>
  );
};

export default EventCard;
