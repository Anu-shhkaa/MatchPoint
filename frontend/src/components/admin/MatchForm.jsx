// components/admin/MatchForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';

const MatchForm = ({ eventId, onMatchCreated }) => {
  const [formData, setFormData] = useState({
    sport: '',
    teamA: '',
    teamB: '',
    matchDate: '',
    venue: ''
  });
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, teamsRes] = await Promise.all([
          api.get('/data/sports'),
          api.get('/data/teams')
        ]);
        setSports(sportsRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error('Failed to load form data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.teamA === formData.teamB) {
      alert('Team A and Team B cannot be the same');
      return;
    }

    setLoading(true);
    try {
      const matchData = {
        ...formData,
        event: eventId
      };
      
      await api.post('/matches', matchData);
      alert('Match created successfully!');
      setFormData({ sport: '', teamA: '', teamB: '', matchDate: '', venue: '' });
      onMatchCreated(); // Refresh matches list
    } catch (err) {
      console.error('Error creating match:', err);
      alert('Error creating match: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Create New Match</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-style">Sport</label>
          <select 
            value={formData.sport} 
            onChange={(e) => setFormData({...formData, sport: e.target.value})}
            className="input-field"
            required
          >
            <option value="">Select Sport</option>
            {sports.map(sport => (
              <option key={sport._id} value={sport._id}>{sport.name}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-style">Team A</label>
            <select 
              value={formData.teamA} 
              onChange={(e) => setFormData({...formData, teamA: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Select Team A</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label-style">Team B</label>
            <select 
              value={formData.teamB} 
              onChange={(e) => setFormData({...formData, teamB: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Select Team B</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="label-style">Match Date & Time</label>
          <input
            type="datetime-local"
            value={formData.matchDate}
            onChange={(e) => setFormData({...formData, matchDate: e.target.value})}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="label-style">Venue</label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({...formData, venue: e.target.value})}
            className="input-field"
            placeholder="Enter venue"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating Match...' : 'Create Match'}
        </button>
      </form>
    </div>
  );
};

export default MatchForm;