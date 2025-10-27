import React, { useState, useEffect, useCallback } from 'react';
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

  // Helper function to extract data from API responses
  const extractData = (response) => {
    if (!response || !response.data) {
      console.warn('No response or data found:', response);
      return [];
    }
    
    // If response.data is already an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If response.data has a data property that's an array
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // If response is an object with array properties
    if (typeof response.data === 'object') {
      // Try to find any array property
      for (let key in response.data) {
        if (Array.isArray(response.data[key])) {
          return response.data[key];
        }
      }
    }
    
    console.warn('Unexpected response format:', response);
    return [];
  };

  // Fetch data function with useCallback to prevent infinite re-renders
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching homepage data...');
      
      const [liveMatchesRes, recentMatchesRes, eventsRes] = await Promise.all([
        api.get('/matches?status=live'),
        api.get('/matches?status=completed&limit=4&sort=desc'),
        api.get('/events')
      ]);

      // Extract data from responses
      const liveMatchesData = extractData(liveMatchesRes);
      const recentMatchesData = extractData(recentMatchesRes);
      const eventsData = extractData(eventsRes);

      // Debug: Check event poster data
      console.log('🎯 API RESPONSES:', {
        liveMatches: liveMatchesRes.data,
        recentMatches: recentMatchesRes.data,
        events: eventsRes.data
      });
      
      console.log('📊 EXTRACTED DATA:', {
        liveMatches: liveMatchesData.length,
        recentMatches: recentMatchesData.length,
        events: eventsData.length
      });

      // Debug event posters
      if (eventsData.length > 0) {
        console.log('📸 EVENT POSTERS:');
        eventsData.forEach(event => {
          console.log(`Event: ${event.name}`, {
            poster: event.poster,
            hasPoster: !!event.poster,
            fullPosterUrl: event.poster ? `http://localhost:5000${event.poster}` : 'No poster'
          });
        });
      }

      setLiveMatches(liveMatchesData);
      setRecentMatches(recentMatchesData);
      setEvents(eventsData);

      console.log('✅ Data loaded successfully');

    } catch (err) {
      console.error("❌ Error fetching homepage data", err);
      console.error("Error details:", err.response?.data || err.message);
      setLiveMatches([]);
      setRecentMatches([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Single useEffect for initial data fetching
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Socket effects
  useEffect(() => {
    if (socket) {
      console.log('🔌 Setting up socket listeners...');

      const handleScoreUpdated = (updatedScore) => {
        console.log('📡 Score updated:', updatedScore);
        setLiveMatches(prevMatches =>
          Array.isArray(prevMatches) ? prevMatches.map(m =>
            m._id === updatedScore.matchId
              ? { ...m, score: updatedScore.score }
              : m
          ) : []
        );
      };

      const handleMatchStarted = (newMatch) => {
        console.log('📡 Match started:', newMatch);
        // Refetch data when new match starts
        fetchData();
      };

      const handleMatchEnded = (endedMatchId) => {
        console.log('📡 Match ended:', endedMatchId);
        // Refetch data when match ends
        fetchData();
      };

      socket.on('scoreUpdated', handleScoreUpdated);
      socket.on('matchStarted', handleMatchStarted);
      socket.on('matchEnded', handleMatchEnded);

      return () => {
        console.log('🔌 Cleaning up socket listeners...');
        socket.off('scoreUpdated', handleScoreUpdated);
        socket.off('matchStarted', handleMatchStarted);
        socket.off('matchEnded', handleMatchEnded);
      };
    }
  }, [socket, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200 text-lg">Loading Dashboard...</p>
          <p className="text-blue-300/70 text-sm mt-2">MatchPoint VESIT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 text-blue-50 pb-16 md:pb-0">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            MatchPoint <span className="text-blue-400">VESIT</span>
          </h1>
          <p className="text-blue-200/80 text-lg md:text-xl max-w-2xl mx-auto">
            Official Sports Management Platform of Vivekanand Education Society's Institute of Technology
          </p>
        </section>

        {/* Live Matches Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Live Matches
              </h2>
              <p className="text-blue-200/70 text-sm">
                Real-time updates from ongoing games
              </p>
            </div>
            <Link 
              to="/matches/live" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm md:text-base flex items-center gap-2"
            >
              View All 
              <span className="text-lg">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(liveMatches) && liveMatches.length > 0 ? (
              liveMatches.map(match => (
                <LiveScoreCard key={match._id} match={match} />
              ))
            ) : (
              <div className="col-span-full bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 text-center">
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayIcon className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-blue-200 text-lg font-medium">
                  No live matches right now
                </p>
                <p className="text-blue-300/70 text-sm mt-2">
                  Check back later for live action!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Upcoming Events
              </h2>
              <p className="text-blue-200/70 text-sm">
                Tournaments and competitions at VESIT
              </p>
            </div>
            <Link 
              to="/events" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm md:text-base flex items-center gap-2"
            >
              View All 
              <span className="text-lg">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(events) && events.length > 0 ? (
              events.map(event => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <div className="col-span-full bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 text-center">
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDaysIcon className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-blue-200 text-lg font-medium">
                  No upcoming events
                </p>
                <p className="text-blue-300/70 text-sm mt-2">
                  Events will appear here when scheduled
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Matches Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Recent Results
              </h2>
              <p className="text-blue-200/70 text-sm">
                Latest match outcomes and scores
              </p>
            </div>
            <Link 
              to="/matches/completed" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm md:text-base flex items-center gap-2"
            >
              View All 
              <span className="text-lg">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {Array.isArray(recentMatches) && recentMatches.length > 0 ? (
              recentMatches.map(match => (
                <div
                  key={match._id}
                  className="bg-slate-800/30 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-blue-800/20 hover:border-blue-600/30 transition-all duration-300 hover:scale-105 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                >
                  <div className="flex-1">
                    <span className="text-green-400 text-xs font-bold bg-green-900/30 px-3 py-1 rounded-full border border-green-800/50">
                      FINISHED
                    </span>
                    <h3 className="font-bold text-lg mt-3 text-white group-hover:text-blue-300 transition-colors">
                      {match.sport?.name || 'Sport'}
                    </h3>
                    <p className="text-blue-200/80 text-sm mt-2">
                      {match.result?.winnerTeam?.name || 'N/A'} beat {match.result?.loserTeam?.name || 'N/A'}
                    </p>
                    <p className="text-blue-300/60 text-xs mt-2">
                      {match.event?.name || 'Event'}
                    </p>
                  </div>
                  <div className="bg-blue-900/50 px-4 py-3 rounded-lg min-w-20 text-center border border-blue-700/30 group-hover:border-blue-500/50 transition-colors">
                    <p className="font-bold text-xl text-blue-300">
                      {match.result?.score || 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 text-center">
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-blue-200 text-lg font-medium">
                  No recent matches
                </p>
                <p className="text-blue-300/70 text-sm mt-2">
                  Completed matches will appear here
                </p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-blue-800/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">About MatchPoint</h3>
          <p className="text-blue-200/80 leading-relaxed max-w-4xl mx-auto">
            MatchPoint is the official sports management platform for VESIT, Navi Mumbai. 
            Follow live scores, check event schedules, and view points tables for all college 
            sports events including <span className="text-blue-300 font-semibold">Sphurti</span>, 
            <span className="text-blue-300 font-semibold"> VPL</span>, and 
            <span className="text-blue-300 font-semibold"> VCL</span>.
          </p>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

// Icons
const PlayIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const CalendarDaysIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
  </svg>
);

const ChartBarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
  </svg>
);

export default HomePage;