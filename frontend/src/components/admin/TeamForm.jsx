import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';

const TeamForm = ({ onDataAdded }) => {
  const [name, setName] = useState('');
  const [teamType, setTeamType] = useState('Department');
  const [department, setDepartment] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  // Fetch events to link franchise teams
  useEffect(() => {
    if (teamType === 'Franchise') {
      api.get('/api/events').then(res => setEvents(res.data)).catch(err => console.error(err));
    }
  }, [teamType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const teamData = {
      name,
      teamType,
      department: teamType === 'Department' ? department : undefined,
      event: teamType === 'Franchise' ? selectedEvent : undefined,
    };
    
    try {
      await api.post('/api/data/teams', teamData);
      onDataAdded(); // Refresh parent list
      alert('Team added!');
      // Reset form
      setName('');
      setTeamType('Department');
      setDepartment('');
      setSelectedEvent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add team');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Team Name (e.g., IT or IT Strikers)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
        required
      />
      <select
        value={teamType}
        onChange={(e) => setTeamType(e.target.value)}
        className="input-field"
      >
        <option value="Department">Department (Permanent)</option>
        <option value="Franchise">Franchise (Event-Specific)</option>
      </select>
      
      {teamType === 'Department' && (
        <input
          type="text"
          placeholder="Department Name (e.g., Information Technology)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="input-field"
        />
      )}
      
      {teamType === 'Franchise' && (
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Link to an Event</option>
          {events.map(event => (
            <option key={event._id} value={event._id}>{event.name}</option>
          ))}
        </select>
      )}
      
      <button type="submit" className="btn-primary">Add Team</button>
    </form>
  );
};

export default TeamForm;
