import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import Modal from '../../components/common/Modal'; // <-- 1. IMPORT THE MODAL

const AdminMatchPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  
  // State for final result form
  const [winner, setWinner] = useState('');
  const [winnerAch, setWinnerAch] = useState(0);
  const [loserAch, setLoserAch] = useState(0);
  const [finalScore, setFinalScore] = useState('');

  // --- 2. ADD STATE FOR THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. Fetch Match Data ---
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        // ... (existing code) ...
        // This logic is all correct
        const res = await api.get(`/api/matches/${matchId}`);
        setMatch(res.data);
        setScoreA(res.data.score?.teamA_score || 0);
        setScoreB(res.data.score?.teamB_score || 0);
        // Pre-fill form if data exists
        setWinner(res.data.result?.winnerTeam || '');
        setWinnerAch(res.data.result?.winnerAchievement || 0);
        setLoserAch(res.data.result?.loserAchievement || 0);
        setFinalScore(res.data.result?.score || '0-0');
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  // --- 2. Live Score Update Function ---
  // This logic is correct
  const handleScoreUpdate = (team, points) => {
    // ... (existing code) ...
    let newScoreA = scoreA;
    let newScoreB = scoreB;

    if (team === 'A') {
      newScoreA += points;
      setScoreA(newScoreA);
    } else {
      newScoreB += points;
      setScoreB(newScoreB);
    }
    
    if (socket) {
      socket.emit('updateScore', {
        matchId,
        score: { // Send score as an object
          teamA_score: newScoreA,
          teamB_score: newScoreB,
        }
      });
    }
  };

  // --- 3. Final Result Submit Function ---
  const handleFinalizeMatch = async () => { // <-- 4. REMOVED 'e' PARAMETER
    // e.preventDefault(); // <-- No longer needed
    if (!winner) return alert('Please select a winner');
    
    const loser = winner === match.teamA._id ? match.teamB._id : match.teamA._id;
    
    const resultData = {
      winnerTeam: winner,
      loserTeam: loser,
      winnerAchievement: Number(winnerAch),
      loserAchievement: Number(loserAch),
      score: finalScore,
    };
    
    try {
      await api.put(`/api/matches/${matchId}/result`, resultData);
      alert('Match finalized and points table updated!');
      setIsModalOpen(false); // Close the modal on success
      navigate(`/admin/events/${match.event._id}`); // Go back
    } catch (err) {
      console.error(err);
      alert('Failed to finalize match.');
    }
  };

  if (loading) return <div>Loading match...</div>; // You can use your <Spinner />
  if (!match) return <div>Match not found.</div>;

  const pointingLevels = match.event.pointingSystem.levels;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Match</h1>
      {/* ... (existing code for h2 title) ... */}
      
      {/* --- Live Score Panel --- */}
      {/* ... (existing code for score panel) ... */}
      
      {/* --- Final Result Form --- */}
      <form className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow space-y-4">
        <h3 className="text-xl font-bold mb-4">Finalize Match Result</h3>
        {/* ... (existing code for form inputs) ... */}
        
        {/* --- 5. UPDATED BUTTON --- */}
        <button 
          type="button" // Changed from "submit"
          className="btn-danger"
          onClick={() => setIsModalOpen(true)} // Opens the modal
        >
          Finalize Match
        </button>
      </form>

      {/* --- 6. ADD THE MODAL COMPONENT --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Confirm Finalize Match"
      >
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Are you sure you want to finalize this match? This action is permanent and will update the points table.
        </p>
        <div className="mt-6 flex gap-4">
          <button 
            className="btn-danger" 
            onClick={handleFinalizeMatch} // Calls the finalize function
          >
            Yes, Finalize Match
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMatchPage;

