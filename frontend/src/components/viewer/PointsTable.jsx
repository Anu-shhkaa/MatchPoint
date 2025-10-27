import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useSocket } from '../../context/SocketContext';

// This component can be used on both the viewer and admin pages
const PointsTable = ({ eventId }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  // --- 1. Function to Fetch Data ---
  const fetchPointsTable = async () => {
    try {
      setLoading(true);
      // Call the API route we created
      const res = await api.get(`/pointstable/event/${eventId}`);
      // Sort by total points, descending
      res.data.sort((a, b) => b.totalPoints - a.totalPoints);
      setPoints(res.data);
    } catch (err) {
      console.error("Failed to fetch points table", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Fetch Data on Load ---
  useEffect(() => {
    if (eventId) {
      fetchPointsTable();
    }
  }, [eventId]);

  // --- 3. Listen for Real-Time Updates ---
  useEffect(() => {
    if (socket) {
      // Listen for the event your backend sends after a match is finalized
      socket.on('pointsTableUpdated', (data) => {
        // If the update is for this event, refresh the table!
        if (data.eventId === eventId) {
          fetchPointsTable();
        }
      });

      return () => {
        socket.off('pointsTableUpdated');
      };
    }
  }, [socket, eventId]);

  if (loading) return <div>Loading Points Table...</div>;

  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Team</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Base Points</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Joker Points</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Total Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {points.map((entry, index) => (
            <tr key={entry.team._id} className={index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : ''}>
              <td className="px-6 py-4 font-bold">{index + 1}</td>
              <td className="px-6 py-4 font-medium">{entry.team.name}</td>
              <td className="px-6 py-4">{entry.basePoints}</td>
              <td className="px-6 py-4">{entry.jokerPoints}</td>
              <td className="px-6 py-4 font-bold text-lg">{entry.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;
