import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/API_Service';
import { useSocket } from '../../context/SocketContext';

const ControlLiveMatchPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [score, setScore] = useState({ teamA: 0, teamB: 0 });
  const [winner, setWinner] = useState('');

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      setMatch(response.data);
      setScore({
        teamA: response.data.score ? parseInt(response.data.score.split('-')[0]) : 0,
        teamB: response.data.score ? parseInt(response.data.score.split('-')[1]) : 0
      });
    } catch (error) {
      console.error('Error fetching match:', error);
      alert('Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const startMatchLive = async () => {
    try {
      setUpdating(true);
      const response = await api.put(`/matches/${matchId}/live`);
      setMatch(response.data);
      alert('Match is now LIVE!');
    } catch (error) {
      console.error('Error starting match:', error);
      alert('Failed to start match');
    } finally {
      setUpdating(false);
    }
  };

  const updateScore = async () => {
    try {
      setUpdating(true);
      const scoreString = `${score.teamA}-${score.teamB}`;
      const response = await api.put(`/matches/${matchId}/score`, {
        score: scoreString
      });
      setMatch(response.data);
      alert('Score updated!');
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to update score');
    } finally {
      setUpdating(false);
    }
  };

  const endMatch = async () => {
    if (!winner) {
      alert('Please select a winner');
      return;
    }

    try {
      setUpdating(true);
      const response = await api.put(`/matches/${matchId}/result`, {
        winnerTeam: winner,
        loserTeam: winner === match.teamA._id ? match.teamB._id : match.teamA._id,
        winnerAchievement: 5, // Winner
        loserAchievement: 4, // Runner-up
        score: `${score.teamA}-${score.teamB}`
      });
      setMatch(response.data);
      alert('Match completed!');
      navigate('/admin/matches');
    } catch (error) {
      console.error('Error ending match:', error);
      alert('Failed to end match');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Match not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Control Live Match
        </h1>

        {/* Match Info */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Match Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Event:</strong> {match.event?.name}</p>
              <p><strong>Sport:</strong> {match.sport?.name}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  match.status === 'live' ? 'bg-green-500 text-white' : 
                  match.status === 'completed' ? 'bg-blue-500 text-white' : 
                  'bg-yellow-500 text-white'
                }`}>
                  {match.status?.toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <p><strong>Team A:</strong> {match.teamA?.name}</p>
              <p><strong>Team B:</strong> {match.teamB?.name}</p>
              <p><strong>Current Score:</strong> {match.score || '0-0'}</p>
            </div>
          </div>
        </div>

        {/* Match Controls */}
        <div className="space-y-6">
          {/* Start Match Button */}
          {match.status === 'scheduled' && (
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Start Match</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Click below to start the match and make it LIVE for all viewers.
              </p>
              <button
                onClick={startMatchLive}
                disabled={updating}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? 'Starting...' : 'Start Match Live'}
              </button>
            </div>
          )}

          {/* Score Update */}
          {(match.status === 'live' || match.status === 'scheduled') && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Update Score</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    {match.teamA?.name} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={score.teamA}
                    onChange={(e) => setScore({...score, teamA: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="text-2xl font-bold">VS</div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    {match.teamB?.name} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={score.teamB}
                    onChange={(e) => setScore({...score, teamB: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <button
                onClick={updateScore}
                disabled={updating}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Score'}
              </button>
            </div>
          )}

          {/* End Match */}
          {match.status === 'live' && (
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">End Match</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Winner
                </label>
                <select
                  value={winner}
                  onChange={(e) => setWinner(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select winner...</option>
                  <option value={match.teamA._id}>{match.teamA?.name}</option>
                  <option value={match.teamB._id}>{match.teamB?.name}</option>
                </select>
              </div>
              <button
                onClick={endMatch}
                disabled={updating || !winner}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? 'Ending...' : 'End Match & Declare Winner'}
              </button>
            </div>
          )}

          {match.status === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Match Completed</h3>
              <p className="text-green-700 dark:text-green-300">
                This match has been completed. Winner: {
                  match.result?.winnerTeam === match.teamA._id ? 
                  match.teamA?.name : match.teamB?.name
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlLiveMatchPage;