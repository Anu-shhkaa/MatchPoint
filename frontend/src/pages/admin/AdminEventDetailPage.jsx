import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PointsTable from '../../components/viewer/PointsTable';
import { PlusIcon, SparklesIcon, PencilIcon, PlayIcon } from '@heroicons/react/24/solid';
import { useSocket } from '../../context/SocketContext';

const AdminEventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [event, setEvent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [sport, setSport] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [venue, setVenue] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, matchesRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/matches/by-event/${eventId}`)
      ]);
      setEvent(eventRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error("Failed to fetch event data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatchLive = async (matchId) => {
    try {
      await api.put(`/matches/${matchId}/live`);
      alert('Match is now live!');
    } catch (err) {
      console.error('Error starting match:', err);
      alert('Failed to start match: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleControlMatch = (matchId) => {
    navigate(`/admin/match/${matchId}/control`);
  };

  useEffect(() => {
    fetchData();

    if (socket) {
      socket.on('scoreUpdated', (updatedMatch) => {
        if (updatedMatch.event === eventId || updatedMatch.event._id === eventId) {
          setMatches(prev => prev.map(match => 
            match._id === updatedMatch._id ? updatedMatch : match
          ));
        }
      });

      socket.on('matchStarted', (startedMatch) => {
        if (startedMatch.event === eventId || startedMatch.event._id === eventId) {
          setMatches(prev => prev.map(match => 
            match._id === startedMatch._id ? startedMatch : match
          ));
        }
      });

      socket.on('matchCompleted', (completedMatch) => {
        if (completedMatch.event === eventId || completedMatch.event._id === eventId) {
          setMatches(prev => prev.map(match => 
            match._id === completedMatch._id ? completedMatch : match
          ));
        }
      });

      return () => {
        if (socket) {
          socket.off('scoreUpdated');
          socket.off('matchStarted');
          socket.off('matchCompleted');
        }
      };
    }
  }, [eventId, socket]);

  const handleAddMatch = async (e) => {
    e.preventDefault();
    if (!teamA || !teamB || !sport || !matchDate || !venue) {
      return alert('Please fill all fields');
    }
    
    if (teamA === teamB) {
      return alert('Team A and Team B cannot be the same');
    }
    
    try {
      await api.post('/matches', {
        event: eventId,
        sport,
        teamA,
        teamB,
        matchDate,
        venue
      });
      alert('Match added successfully!');
      fetchData();
      setTeamA('');
      setTeamB('');
      setSport('');
      setMatchDate('');
      setVenue('');
    } catch (err) {
      console.error('Error creating match:', err);
      alert('Failed to add match: ' + (err.response?.data?.message || err.message));
    }
  };
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-lg text-gray-900 dark:text-white">Loading event data...</span>
    </div>
  );
  
  if (!event) return <div className="p-6 text-red-500">Event not found.</div>;

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{event.eventType} • {event.sports?.length || 0} Sports • {event.teams?.length || 0} Teams</p>
        </div>
        
        {event.hasJokerFeature && (
          <Link
            to={`/admin/joker/${eventId}`}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
          >
            <SparklesIcon className="h-5 w-5" />
            Apply Joker Logic
          </Link>
        )}
      </div>

      {/* Add New Match Form */}
      <form onSubmit={handleAddMatch} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Match</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sport *</label>
            <select 
              value={sport} 
              onChange={(e) => setSport(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="">Select Sport</option>
              {event.sports?.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.genderCategory})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team A *</label>
            <select 
              value={teamA} 
              onChange={(e) => setTeamA(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="">Select Team A</option>
              {event.teams?.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team B *</label>
            <select 
              value={teamB} 
              onChange={(e) => setTeamB(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="">Select Team B</option>
              {event.teams?.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Match Date *</label>
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue *</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Enter venue name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Match
        </button>
      </form>

      {/* List of All Matches */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Matches ({matches.length})</h2>
          {socket && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Updates Connected
            </div>
          )}
        </div>
        
        {matches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No matches scheduled yet.</p>
        ) : (
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match._id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                    {match.sport?.name}
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {match.teamA?.name} vs {match.teamB?.name}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <p>Date: {new Date(match.matchDate).toLocaleString()}</p>
                    <p>Venue: {match.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    match.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    match.status === 'live' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {match.status?.toUpperCase() || 'SCHEDULED'}
                  </span>
                  
                  {match.status === 'scheduled' && (
                    <button 
                      onClick={() => handleStartMatchLive(match._id)}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                      title="Start Match Live"
                    >
                      <PlayIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  {match.status === 'live' && (
                    <button 
                      onClick={() => handleControlMatch(match._id)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      title="Control Live Match"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  <Link
                    to={`/admin/match/${match._id}`}
                    className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    title="Edit Match"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Points Table */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Points Table</h2>
        <PointsTable eventId={eventId} />
      </div>
    </div>
  );
};

export default AdminEventDetailPage;