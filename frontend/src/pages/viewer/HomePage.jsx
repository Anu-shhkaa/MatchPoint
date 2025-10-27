import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useSocket } from '../../context/SocketContext';
import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import LiveScoreCard from '../../components/viewer/LiveScoreCard';
import EventCard from '../../components/viewer/EventCard';

const HomePage = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  // Single useEffect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [liveMatchesRes, recentMatchesRes, eventsRes] = await Promise.all([
          api.get('/matches?status=live&limit=4'),
          api.get('/matches?status=completed&limit=4&sort=desc'),
          api.get('/events?limit=4')
        ]);

        // Debug: Check event poster data
        console.log('🎯 EVENTS WITH POSTER DATA:');
        eventsRes.data.forEach(event => {
          console.log(`📸 Event: ${event.name}`, {
            id: event._id,
            poster: event.poster,
            hasPoster: !!event.poster,
            fullPosterUrl: event.poster ? `http://localhost:5000${event.poster}` : 'No poster',
            posterExists: event.poster ? 'Yes' : 'No'
          });
        });

        setLiveMatches(Array.isArray(liveMatchesRes.data) ? liveMatchesRes.data : []);
        setRecentMatches(Array.isArray(recentMatchesRes.data) ? recentMatchesRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);

      } catch (err) {
        console.error("Error fetching homepage data", err);
        setLiveMatches([]);
        setRecentMatches([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Socket effects
  useEffect(() => {
    if (socket) {
      socket.on('scoreUpdated', (updatedScore) => {
        setLiveMatches(prevMatches =>
          Array.isArray(prevMatches) ? prevMatches.map(m =>
            m._id === updatedScore.matchId
              ? { ...m, score: updatedScore.score }
              : m
          ) : []
        );
      });

      socket.on('matchStarted', (newMatch) => {
        fetchData();
      });

      socket.on('matchEnded', (endedMatchId) => {
        fetchData();
      });

      return () => {
        socket.off('scoreUpdated');
        socket.off('matchStarted');
        socket.off('matchEnded');
      };
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Live Matches Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Live Matches
            </h2>
            <Link 
              to="/matches/live" 
              className="text-blue-600 hover:text-blue-700 text-sm md:text-base"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(liveMatches) && liveMatches.length > 0 ? (
              liveMatches.map(match => <LiveScoreCard key={match._id} match={match} />)
            ) : (
              <div className="col-span-full bg-surface-light dark:bg-surface-dark rounded-lg p-8 text-center">
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg">
                  No live matches right now.
                </p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-2">
                  Check back later for live action!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Upcoming Events
            </h2>
            <Link 
              to="/events" 
              className="text-blue-600 hover:text-blue-700 text-sm md:text-base"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(events) && events.length > 0 ? (
              events.map(event => <EventCard key={event._id} event={event} />)
            ) : (
              <div className="col-span-full bg-surface-light dark:bg-surface-dark rounded-lg p-8 text-center">
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg">
                  No events found.
                </p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-2">
                  Events will appear here when created.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Matches Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Recent Results
            </h2>
            <Link 
              to="/matches/completed" 
              className="text-blue-600 hover:text-blue-700 text-sm md:text-base"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {Array.isArray(recentMatches) && recentMatches.length > 0 ? (
              recentMatches.map(match => (
                <div
                  key={match._id}
                  className="bg-surface-light dark:bg-surface-dark p-4 md:p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <span className="text-green-500 text-xs font-bold bg-green-50 dark:bg-green-900 px-2 py-1 rounded">
                      FINISHED
                    </span>
                    <h3 className="font-bold text-lg mt-2 text-text-light-primary dark:text-text-dark-primary">
                      {match.sport?.name || 'Sport'}
                    </h3>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-1">
                      {match.result?.winnerTeam?.name || 'N/A'} beat {match.result?.loserTeam?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900 px-4 py-3 rounded-lg min-w-20 text-center">
                    <p className="font-bold text-xl text-blue-600 dark:text-blue-300">
                      {match.result?.score || 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-surface-light dark:bg-surface-dark rounded-lg p-8 text-center">
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg">
                  No recent matches.
                </p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-2">
                  Completed matches will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;