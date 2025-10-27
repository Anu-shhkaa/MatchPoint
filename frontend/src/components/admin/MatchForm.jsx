// components/admin/MatchForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { PlusIcon } from '@heroicons/react/24/solid';

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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Loading form data...');
        const [sportsRes, teamsRes] = await Promise.all([
          api.get('/data/sports'),
          api.get('/data/teams')
        ]);

        // Handle different response formats
        const sportsData = Array.isArray(sportsRes.data) ? sportsRes.data : 
                          (sportsRes.data?.data || []);
        const teamsData = Array.isArray(teamsRes.data) ? teamsRes.data : 
                         (teamsRes.data?.data || []);

        console.log('📦 Sports data:', sportsData);
        console.log('📦 Teams data:', teamsData);

        setSports(sportsData);
        setTeams(teamsData);
      } catch (err) {
        console.error('❌ Failed to load form data:', err);
        setError('Failed to load sports and teams data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.teamA === formData.teamB) {
      setError('Team A and Team B cannot be the same');
      return;
    }

    setLoading(true);
    try {
      const matchData = {
        ...formData,
        event: eventId
      };
      
      console.log('🎯 Creating match with data:', matchData);
      await api.post('/matches', matchData);
      
      // Show success message
      setError('');
      alert('🎉 Match created successfully!');
      
      // Reset form
      setFormData({ 
        sport: '', 
        teamA: '', 
        teamB: '', 
        matchDate: '', 
        venue: '' 
      });
      
      // Refresh matches list
      onMatchCreated();
      
    } catch (err) {
      console.error('❌ Error creating match:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create match';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 backdrop-blur-sm rounded-xl border border-blue-800/30 shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
          <PlusIcon className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Create New Match</h3>
          <p className="text-blue-200/70 text-sm">
            Schedule a new match for this event
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-red-300">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sport Selection */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Sport <span className="text-red-400">*</span>
          </label>
          <select 
            value={formData.sport} 
            onChange={(e) => handleChange('sport', e.target.value)}
            className="w-full bg-slate-800/50 border border-blue-700/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          >
            <option value="" className="text-blue-300/50">Select a sport...</option>
            {sports.map(sport => (
              <option key={sport._id} value={sport._id} className="text-white bg-slate-800">
                {sport.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Teams Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Team A <span className="text-red-400">*</span>
            </label>
            <select 
              value={formData.teamA} 
              onChange={(e) => handleChange('teamA', e.target.value)}
              className="w-full bg-slate-800/50 border border-blue-700/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            >
              <option value="" className="text-blue-300/50">Select Team A...</option>
              {teams.map(team => (
                <option key={team._id} value={team._id} className="text-white bg-slate-800">
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Team B <span className="text-red-400">*</span>
            </label>
            <select 
              value={formData.teamB} 
              onChange={(e) => handleChange('teamB', e.target.value)}
              className="w-full bg-slate-800/50 border border-blue-700/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            >
              <option value="" className="text-blue-300/50">Select Team B...</option>
              {teams.map(team => (
                <option key={team._id} value={team._id} className="text-white bg-slate-800">
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Match Date & Time */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Match Date & Time <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.matchDate}
            onChange={(e) => handleChange('matchDate', e.target.value)}
            className="w-full bg-slate-800/50 border border-blue-700/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>
        
        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Venue <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => handleChange('venue', e.target.value)}
            className="w-full bg-slate-800/50 border border-blue-700/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter match venue (e.g., Main Ground, Indoor Court)"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-800 disabled:to-blue-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Creating Match...
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5" />
              Create Match
            </>
          )}
        </button>
      </form>

      {/* Form Status */}
      <div className="mt-4 text-center">
        <p className="text-blue-300/50 text-sm">
          All fields are required. Match will be scheduled as pending.
        </p>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

// Exclamation Circle Icon
const ExclamationCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

export default MatchForm;