import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PointsTable from '../../components/viewer/PointsTable'; // Re-use the component!
import { PlusIcon, SparklesIcon, PencilIcon } from '@heroicons/react/24/solid';

const AdminEventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the "Add Match" form
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [sport, setSport] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, matchesRes] = await Promise.all([
        api.get(`/api/events/${eventId}`),
        api.get(`/api/matches/by-event/${eventId}`)
      ]);
      setEvent(eventRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error("Failed to fetch event data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleAddMatch = async (e) => {
    e.preventDefault();
    if (!teamA || !teamB || !sport) return alert('Please fill all fields');
    
    try {
      await api.post('/api/matches', {
        event: eventId,
        sport,
        teamA,
        teamB,
      });
      alert('Match added!');
      fetchData(); // Refresh the match list
      // Reset form
      setTeamA('');
      setTeamB('');
      setSport('');
    } catch (err) {
      console.error(err);
      alert('Failed to add match');
    }
  };
  
  if (loading) return <div>Loading event data...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        {/* --- Joker Button: Show only if feature is enabled --- */}
        {event.hasJokerFeature && (
          <Link
            to={`/admin/joker/${eventId}`}
            className="btn-danger flex items-center gap-2"
          >
            <SparklesIcon className="h-5 w-5" />
            Apply Joker Logic
          </Link>
        )}
      </div>

      {/* --- Add New Match Form --- */}
      <form onSubmit={handleAddMatch} className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow space-y-4">
        <h2 className="text-xl font-bold">Add New Match</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={sport} onChange={(e) => setSport(e.target.value)} className="input-field" required>
            <option value="">Select Sport</option>
            {event.sports.map(s => <option key={s._id} value={s._id}>{s.name} ({s.genderCategory})</option>)}
          </select>
          <select value={teamA} onChange={(e) => setTeamA(e.target.value)} className="input-field" required>
            <option value="">Select Team A</option>
            {event.teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <select value={teamB} onChange={(e) => setTeamB(e.target.value)} className="input-field" required>
            <option value="">Select Team B</option>
            {event.teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Match
        </button>
      </form>

      {/* --- List of All Matches --- */}
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <h2 className="text-xl font-bold mb-4">Matches</h2>
        <div className="space-y-2">
          {matches.map(match => (
            <div key={match._id} className="flex justify-between items-center p-3 rounded bg-gray-100 dark:bg-gray-800">
              <div>
                <span className="text-xs font-bold uppercase">{match.sport.name}</span>
                <p className="font-medium">{match.teamA.name} vs {match.teamB.name}</p>
                <span className={`text-xs font-bold ${match.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {match.status.toUpperCase()}
                </span>
              </div>
              <Link
                to={`/admin/match/${match._id}`}
                className="btn-secondary p-2"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* --- Live Points Table --- */}
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <h2 className="text-xl font-bold mb-4">Live Points Table</h2>
        <PointsTable eventId={eventId} />
      </div>
    </div>
  );
};

export default AdminEventDetailPage;
