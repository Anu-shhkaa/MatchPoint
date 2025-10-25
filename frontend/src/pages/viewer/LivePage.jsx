import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useSocket } from '../../context/SocketContext';


const LivePage = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socket = useSocket();

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      // You'll need to update your backend route to filter by status
      const res = await api.get('/api/matches?status=live'); 
      setLiveMatches(res.data);
       setLiveMatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch live matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);
  
  // --- Real-Time Listeners ---
  useEffect(() => {
    if (socket) {
      // Listen for score updates
      socket.on('scoreUpdated', (updatedMatch) => {
        setLiveMatches(prevMatches =>
          prevMatches.map(m => m._id === updatedMatch.matchId ? { ...m, score: updatedMatch.score } : m)
        );
      });
      
      // Listen for a match starting
      socket.on('matchStarted', (newMatch) => {
        setLiveMatches(prevMatches => [...prevMatches, newMatch]);
      });

      // Listen for a match ending
      socket.on('matchEnded', (endedMatchId) => {
        setLiveMatches(prevMatches => prevMatches.filter(m => m._id !== endedMatchId));
      });

      return () => {
        socket.off('scoreUpdated');
        socket.off('matchStarted');
        socket.off('matchEnded');
      };
    }
  }, [socket]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Live Matches</h1>
      {loading && <p>Loading live matches...</p>}
      
      {!loading && liveMatches.length === 0 && (
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          There are no live matches right now.
        </p>
      )}

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(liveMatches) && liveMatches.length > 0 && (
          liveMatches.map(match => (
            <LiveScoreCard key={match._id} match={match} />
          ))
        )}
      </div>
    </div>
  );
};

export default LivePage;
