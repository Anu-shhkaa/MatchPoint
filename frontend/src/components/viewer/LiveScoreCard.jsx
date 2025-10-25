import React from 'react';
import { Link } from 'react-router-dom';

const LiveScoreCard = ({ match }) => {
  return (
    <Link 
      to={`/events/${match.event._id}`} // Or a direct match page
      className="block bg-surface-light dark:bg-surface-dark shadow-md rounded-lg p-4 overflow-hidden relative border-l-4 border-red-600"
    >
      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
      
      <h3 className="font-bold text-lg mb-2 truncate">{match.sport.name}</h3>
      
      <div className="text-center my-4">
        <span className="text-4xl font-bold">{match.score?.teamA_score || 0} - {match.score?.teamB_score || 0}</span>
      </div>
      
      <div className="flex justify-between text-sm font-medium">
        <span className="truncate w-2/5 text-left">{match.teamA.name}</span>
        <span className="truncate w-2/5 text-right">{match.teamB.name}</span>
      </div>
    </Link>
  );
};

export default LiveScoreCard;
