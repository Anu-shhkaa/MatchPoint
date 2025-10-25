import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useNavigate } from 'react-router-dom';
// You'll need a good multi-select component.
// You can build one or install one like 'react-select'
// npm install react-select
import Select from 'react-select';

const AdminEventCreatePage = () => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Sphurti');
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [hasJoker, setHasJoker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data from API
  const [allSports, setAllSports] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [allSystems, setAllSystems] = useState([]);

  const navigate = useNavigate();

  // Fetch all the data needed for the dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sportsRes, teamsRes, systemsRes] = await Promise.all([
          api.get('/api/data/sports'),
          api.get('/api/data/teams'),
          api.get('/api/data/pointingsystems')
        ]);
        
        // Format for react-select
        setAllSports(sportsRes.data.map(s => ({ value: s._id, label: `${s.name} (${s.genderCategory})` })));
        setAllTeams(teamsRes.data.map(t => ({ value: t._id, label: `${t.name} (${t.teamType})` })));
        setAllSystems(systemsRes.data.map(s => ({ value: s._id, label: s.systemName })));

      } catch (err) {
        console.error("Failed to load form data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      name: eventName,
      eventType: eventType,
      sports: selectedSports.map(s => s.value), // Get just the IDs
      teams: selectedTeams.map(t => t.value),   // Get just the IDs
      pointingSystem: selectedSystem.value, // Get just the ID
      hasJokerFeature: hasJoker,
    };
    
    try {
      const res = await api.post('/api/events', eventData);
      alert('Event created successfully!');
      navigate(`/admin/events/${res.data._id}`); // Go to the new event's detail page
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Error: ' + (err.response?.data?.message || 'Failed to create event'));
    }
  };

  if (loading) return <div>Loading form data...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Event</h1>
      
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <label className="label-style">Event Name</label>
        <input 
          type="text" 
          placeholder="e.g., Indoor Sphurti 2025"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="input-field" // You'll define global styles for .input-field
          required
        />
      </div>

      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <label className="label-style">Event Type</label>
        <select 
          value={eventType} 
          onChange={(e) => setEventType(e.target.value)}
          className="input-field"
        >
          <option value="Sphurti">Sphurti (Multi-Sport)</option>
          <option value="VPL">VPL (League)</option>
          <option value="VCL">VCL (League)</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <label className="label-style">Select Pointing System</label>
        <Select
          options={allSystems}
          value={selectedSystem}
          onChange={setSelectedSystem}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <label className="label-style">Select Participating Sports</label>
        <Select
          isMulti
          options={allSports}
          value={selectedSports}
          onChange={setSelectedSports}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <label className="label-style">Select Participating Teams</label>
        <Select
          isMulti
          options={allTeams}
          value={selectedTeams}
          onChange={setSelectedTeams}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="joker"
            checked={hasJoker}
            onChange={(e) => setHasJoker(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="joker" className="ml-2">Enable Joker Feature for this event</label>
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Create Event
      </button>
    </form>
  );
};

export default AdminEventCreatePage;
