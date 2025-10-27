import React, { useState, useEffect } from 'react';
// --- Ensure correct import name ---
import api from '../../services/API_Service'; 
// --- End Ensure ---

// Accept initialData and isEditMode props
const TeamForm = ({ onDataAdded, initialData = null, isEditMode = false }) => {
  // Form field states
  const [name, setName] = useState('');
  const [teamType, setTeamType] = useState('Department');
  const [department, setDepartment] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(''); // Store only the ID
  // State for event dropdown options
  const [events, setEvents] = useState([]); 
  // Error and loading states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to fetch the list of events (for linking Franchise teams)
  // Runs only when the component mounts or teamType becomes 'Franchise'
  useEffect(() => {
    // Only fetch if type is Franchise AND we don't already have events
    if (teamType === 'Franchise' && events.length === 0) { 
      setError(''); // Clear previous errors
      api.get('/events?minimal=true') // Use the correct path relative to baseURL
         .then(res => {
            // Ensure data is an array before setting
            setEvents(Array.isArray(res.data) ? res.data : []); 
         })
         .catch(err => {
            console.error("Failed to fetch events for team form", err);
            setError('Could not load events list. Please ensure events exist.');
         });
    } else if (teamType !== 'Franchise') {
      // Clear events list if type is not Franchise
      setEvents([]); 
      setSelectedEvent(''); // Also clear selected event
    }
  }, [teamType]); // Dependency: re-run if teamType changes

  // Effect to prefill the form when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name || '');
      setTeamType(initialData.teamType || 'Department');
      setDepartment(initialData.department || '');
      // If it's a franchise team and has an event linked, pre-select its ID
      setSelectedEvent(initialData.event?._id || initialData.event || ''); 
    } else {
      // Reset form fields if not editing or initialData is cleared
      setName('');
      setTeamType('Department');
      setDepartment('');
      setSelectedEvent('');
    }
  }, [isEditMode, initialData]); // Rerun effect if mode or data changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser submit
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    // Construct the data payload based on the team type
    const teamData = {
      name,
      teamType,
      department: teamType === 'Department' ? department : undefined, // Only include if Department
      // Send event ID only if Franchise and an event is selected
      event: teamType === 'Franchise' && selectedEvent ? selectedEvent : undefined, 
    };

    try {
      if (isEditMode && initialData?._id) { // Check if editing and have an ID
        // Call the backend PUT route (ensure PUT /api/data/teams/:id exists)
        await api.put(`/data/teams/${initialData._id}`, teamData);
        alert(`Team "${name}" updated successfully!`);
      } else {
        // Call the backend POST route
        await api.post('/data/teams', teamData);
        alert(`Team "${name}" added successfully!`);
      }
      onDataAdded(); // Callback to refresh the list in AdminManageDataPage
      
      // Reset form fields only if we were adding a new team
      if (!isEditMode) {
          setName('');
          setTeamType('Department');
          setDepartment('');
          setSelectedEvent('');
      }
    } catch (err) {
      // Handle API errors
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} team`, err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} team. Please check the details and try again.`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // --- Render the form ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md mb-6 bg-gray-50 dark:bg-gray-800 shadow-sm">
      {/* Display error message if present */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      {/* Team Name Input */}
      <div>
        <label htmlFor="teamName" className="label-style">Team Name *</label>
        <input
          id="teamName"
          type="text"
          placeholder="Team Name (e.g., IT or IT Strikers)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field" // Use theme input style
          required 
        />
      </div>

      {/* Team Type Select */}
      <div>
         <label htmlFor="teamType" className="label-style">Team Type *</label>
         <select
          id="teamType"
          value={teamType}
          onChange={(e) => setTeamType(e.target.value)}
          className="input-field" // Use theme input style
        >
          <option value="Department">Department (Permanent)</option>
          <option value="Franchise">Franchise (Event-Specific)</option>
        </select>
      </div>
      
      {/* Conditional Fields based on Team Type */}
      {teamType === 'Department' && (
         <div>
          <label htmlFor="departmentName" className="label-style">Department Name</label>
          <input
            id="departmentName"
            type="text"
            placeholder="e.g., Information Technology"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input-field" 
          />
        </div>
      )}
      
      {teamType === 'Franchise' && (
         <div>
          {/* Add loading state for event dropdown */}
          <label htmlFor="linkEvent" className="label-style">
            Link to Event {events.length === 0 ? '(Loading...)' : '*'}
          </label> 
          <select
            id="linkEvent"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="input-field" 
            required // Make required if type is Franchise
            disabled={events.length === 0} // Disable while loading events
          >
            <option value="">-- Select Event --</option>
            {/* Map over the fetched events to create options */}
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </select>
          {events.length === 0 && <p className="text-xs text-gray-500 mt-1">Fetching events...</p>}
         </div>
      )}
      
      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn-primary w-full sm:w-auto" // Use theme button style
        disabled={loading || (teamType === 'Franchise' && events.length === 0)} // Disable while loading or if events haven't loaded for Franchise
      >
        {/* Change button text based on mode and loading state */}
        {loading ? 'Saving...' : (isEditMode ? 'Update Team' : 'Add Team')}
      </button>
    </form>
  );
};

export default TeamForm;

