import React from 'react';
import { Link } from 'react-router-dom';

const LiveScoreCard = ({ match }) => {
  if (!match) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
            LIVE
          </span>
          <h3 className="font-bold text-lg mt-1 text-gray-900 dark:text-white">
            {match.sport?.name || 'Match'}
          </h3>
        </div>
        <Link 
          to={`/matches/${match._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Watch →
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {match.teamA?.name || 'Team A'}
          </span>
          <span className="font-bold text-lg">
            {match.score ? match.score.split('-')[0] : '0'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {match.teamB?.name || 'Team B'}
          </span>
          <span className="font-bold text-lg">
            {match.score ? match.score.split('-')[1] : '0'}
          </span>
        </div>
      </div>

      {match.event && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {match.event.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveScoreCard;