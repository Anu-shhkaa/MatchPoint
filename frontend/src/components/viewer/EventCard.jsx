import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Safe poster check
  const getImageUrl = () => {
    if (!event.poster || event.poster === 'undefined' || event.poster === 'null') {
      return null;
    }
    
    if (event.poster.startsWith('http')) {
      return event.poster;
    }
    
    return `http://localhost:5000${event.poster}`;
  };

  const imageUrl = getImageUrl();

  const handleImageError = (e) => {
    // Hide the broken image
    e.target.style.display = 'none';
    
    // Show the fallback
    const fallback = e.target.nextSibling;
    if (fallback && fallback.classList.contains('image-fallback')) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl}
              alt={`${event.name} poster`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
            {/* Fallback that shows only if image fails */}
            <div 
              className="image-fallback absolute inset-0 hidden w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <div className="text-center text-white p-4">
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-bold text-sm leading-tight">{event.name}</div>
              </div>
            </div>
          </>
        ) : (
          // Default fallback when no poster URL at all
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-sm leading-tight">{event.name}</div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            {event.eventType || 'EVENT'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
          {event.name}
        </h3>
        
        <div className="space-y-1 mb-4 flex-1">
          {event.startDate && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">📅</span>
              <span className="ml-2">{new Date(event.startDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">📍</span>
              <span className="ml-2 line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>

        <Link 
          to={`/events/${event._id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;