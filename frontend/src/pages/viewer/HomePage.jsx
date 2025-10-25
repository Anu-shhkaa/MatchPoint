import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useSocket } from '../../context/SocketContext';
import { Link } from 'react-router-dom';

// --- Import the reusable components ---
import LiveScoreCard from '../../components/viewer/LiveScoreCard';
import EventCard from '../../components/viewer/EventCard';
// You can create this spinner component later
// import Spinner from '../../components/common/Spinner';

const HomePage = () => {
  // --- FIX 1: Ensure initial state is always an array ---
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [events, setEvents] = useState([]);
  // --- End Fix ---
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  // --- 1. Function to Fetch All Data ---
  const fetchData = async () => {
    setLoading(true); // Set loading true at the start
    try {
      const [liveMatchesRes, recentMatchesRes, eventsRes] = await Promise.all([
        api.get('/api/matches?status=live&limit=4'),
        api.get('/api/matches?status=completed&limit=4&sort=desc'),
        api.get('/api/events?limit=4')
      ]);

      // --- FIX 2: Ensure API data is treated as an array ---
      setLiveMatches(Array.isArray(liveMatchesRes.data) ? liveMatchesRes.data : []);
      setRecentMatches(Array.isArray(recentMatchesRes.data) ? recentMatchesRes.data : []);
      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      // --- End Fix ---

    } catch (err) {
      console.error("Error fetching homepage data", err);
      // Set to empty arrays on error to prevent crashes
      setLiveMatches([]);
      setRecentMatches([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Fetch Data on Initial Load ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- 3. Listen for Real-Time Socket Events ---
  useEffect(() => {
    if (socket) {
      socket.on('scoreUpdated', (updatedScore) => {
        setLiveMatches(prevMatches =>
          // Make sure prevMatches is an array before mapping
          Array.isArray(prevMatches) ? prevMatches.map(m =>
            m._id === updatedScore.matchId
              ? { ...m, score: updatedScore.score }
              : m
          ) : [] // Default to empty array if something went wrong
        );
      });

      socket.on('matchStarted', (newMatch) => {
        fetchData(); // Re-fetch all data for simplicity
      });

      socket.on('matchEnded', (endedMatchId) => {
         fetchData(); // Re-fetch all data for simplicity
      });

      return () => {
        socket.off('scoreUpdated');
        socket.off('matchStarted');
        socket.off('matchEnded');
      };
    }
  }, [socket]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  // --- Render Content ---
  return (
    <div className="space-y-12 p-4 md:p-6">

      {/* --- Live Matches Section --- */}
      <section>
        {/* ... (section header code remains the same) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --- FIX 3: Check if it's an array AND has items before mapping --- */}
          {Array.isArray(liveMatches) && liveMatches.length > 0 ? (
            liveMatches.map(match => <LiveScoreCard key={match._id} match={match} />)
          ) : (
            <p className="text-text-light-secondary dark:text-text-dark-secondary col-span-full"> {/* Added col-span-full */}
              No live matches right now.
            </p>
          )}
          {/* --- End Fix --- */}
        </div>
      </section>

      {/* --- Events Section --- */}
      <section>
       {/* ... (section header code remains the same) ... */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           {/* Add array check here too for safety */}
           {Array.isArray(events) && events.length > 0 ? (
            events.map(event => <EventCard key={event._id} event={event} />)
          ) : (
            <p className="text-text-light-secondary dark:text-text-dark-secondary col-span-full"> {/* Added col-span-full */}
              No events found.
            </p>
          )}
        </div>
      </section>

      {/* --- Recent Matches Section --- */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Recent Results</h2>
         <div className="space-y-4">
          {/* Add array check here too */}
          {Array.isArray(recentMatches) && recentMatches.length > 0 ? (
            recentMatches.map(match => (
              <div
                key={match._id}
                className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <span className="text-green-500 text-xs font-bold">FINISHED</span>
                  <h3 className="font-bold">{match.sport?.name || 'Sport'}</h3> {/* Safe access */}
                  <p className="text-sm">
                    {match.result?.winnerTeam?.name || 'N/A'} beat {match.result?.loserTeam?.name || 'N/A'}
                  </p>
                </div>
                <p className="font-bold text-lg">{match.result?.score || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              No recent matches.
            </p>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;

