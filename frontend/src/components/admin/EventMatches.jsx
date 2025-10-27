import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { PencilSquareIcon } from '@heroicons/react/24/solid'; // Import icon

// Assume matches are passed in, already fetched and populated by the parent (AdminEventDetailPage)
const EventMatches = ({ matches, eventId }) => {
  return (
    // Card background: white in light mode, dark gray in dark mode
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Matches ({matches?.length || 0}) {/* Safe access for length */}
      </h2>

      {/* Handle loading or empty state */}
      {!matches ? (
         <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No matches scheduled for this event yet.</p>
      ) : (
        // List of matches
        <div className="space-y-3">
          {matches.map(match => (
            <div
              key={match._id}
              // Match item background and border
              className="border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-md bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                {/* Match Details */}
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-base leading-tight">
                    {/* Safe access for team names */}
                    {match.teamA?.name || 'Team A'} vs {match.teamB?.name || 'Team B'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {/* Safe access for sport name */}
                    {match.sport?.name || 'Sport'}
                    {/* Conditionally display date/time if available */}
                    {/* {match.matchDate && ` • ${new Date(match.matchDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`} */}
                  </p>
                  {/* Conditionally display venue if available */}
                  {/* {match.venue && <p className="text-sm text-gray-500 dark:text-gray-400">Venue: {match.venue}</p>} */}
                </div>

                {/* Status Badge and Manage Link */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0 flex-shrink-0">
                   {/* Status Badge with specific colors */}
                   <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     match.status === 'completed' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                     match.status === 'live' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 animate-pulse' : // Added pulse for live
                     'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300' // Default scheduled
                   }`}>
                     {/* Capitalize status */}
                     {match.status ? match.status.charAt(0).toUpperCase() + match.status.slice(1) : 'Scheduled'}
                   </span>
                   {/* Link to Manage Match Page */}
                   <Link
                      to={`/admin/match/${match._id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1" // Added padding
                      title="Manage Match"
                   >
                     <PencilSquareIcon className="h-5 w-5" />
                   </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventMatches;
