import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useParams } from 'react-router-dom';
import PointsTable from '../../components/viewer/PointsTable'; // Import the component

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('points'); // Default to points table

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // You'll need to build these API routes
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
    fetchData();
  }, [eventId]);
  
  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 font-medium ${
        activeTab === tabName 
          ? 'border-b-2 border-primary-DEFAULT text-primary-DEFAULT' 
          : 'text-text-light-secondary dark:text-text-dark-secondary'
      }`}
    >
      {label}
    </button>
  );

  if (loading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;
  
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{event.name}</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        <TabButton tabName="points" label="Points Table" />
        <TabButton tabName="schedule" label="Schedule" />
        <TabButton tabName="results" label="Results" />
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'points' && (
          <PointsTable eventId={eventId} />
        )}
        
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {scheduledMatches.length > 0 ? scheduledMatches.map(match => (
              <div key={match._id} className="p-4 bg-surface-light dark:bg-surface-dark rounded shadow">
                <h3 className="font-bold">{match.sport.name}</h3>
                <p>{match.teamA.name} vs {match.teamB.name}</p>
              </div>
            )) : <p>No scheduled matches.</p>}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            {completedMatches.length > 0 ? completedMatches.map(match => (
              <div key={match._id} className="p-4 bg-surface-light dark:bg-surface-dark rounded shadow">
                <h3 className="font-bold">{match.sport.name}</h3>
                <p>{match.result.winnerTeam.name} beat {match.result.loserTeam.name}</p>
                <p className="font-bold">{match.result.score}</p>
              </div>
            )) : <p>No completed matches.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
