import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AdminEventCreatePage = () => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Sphurti');
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [hasJoker, setHasJoker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
          api.get('/data/sports'),
          api.get('/data/teams'),
          api.get('/data/pointing-systems')
        ]);
        
        // Format for react-select
        setAllSports(sportsRes.data.map(s => ({ value: s._id, label: `${s.name} (${s.genderCategory})` })));
        setAllTeams(teamsRes.data.map(t => ({ value: t._id, label: `${t.name} (${t.teamType})` })));
        setAllSystems(systemsRes.data.map(s => ({ value: s._id, label: s.systemName })));

      } catch (err) {
        console.error("Failed to load form data", err);
        alert('Failed to load form data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle poster image selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }
      
      setPoster(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPosterPreview(previewUrl);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!selectedSystem) {
    alert('Please select a pointing system');
    return;
  }

  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    alert('End date cannot be before start date');
    return;
  }

  setSubmitting(true);

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', eventName);
    formData.append('eventType', eventType);
    formData.append('sports', JSON.stringify(selectedSports.map(s => s.value)));
    formData.append('teams', JSON.stringify(selectedTeams.map(t => t.value)));
    formData.append('pointingSystem', selectedSystem.value);
    formData.append('hasJokerFeature', hasJoker);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    
    if (poster) {
      formData.append('poster', poster);
    }

    // Debug: Log what we're sending
    console.log('📤 Sending event data:');
    console.log('Event Name:', eventName);
    console.log('Event Type:', eventType);
    console.log('Sports:', selectedSports.map(s => s.value));
    console.log('Teams:', selectedTeams.map(t => t.value));
    console.log('Pointing System:', selectedSystem.value);
    console.log('Has Joker:', hasJoker);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Poster:', poster ? 'Yes' : 'No');

    const res = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    alert('Event created successfully!');
    navigate(`/admin/events/${res.data._id}`);
    
  } catch (err) {
    console.error('❌ Failed to create event:', err);
    console.error('📡 Error response data:', err.response?.data);
    console.error('🚨 Error status:', err.response?.status);
    console.error('🔍 Error details:', err.response);
    
    alert('Error: ' + (err.response?.data?.message || 'Failed to create event'));
  } finally {
    setSubmitting(false);
  }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   // Validation
  //   if (!selectedSystem) {
  //     alert('Please select a pointing system');
  //     return;
  //   }

  //   if (!startDate || !endDate) {
  //     alert('Please select both start and end dates');
  //     return;
  //   }

  //   if (new Date(startDate) > new Date(endDate)) {
  //     alert('End date cannot be before start date');
  //     return;
  //   }

  //   setSubmitting(true);

  //   try {
  //     // Create FormData for file upload
  //     const formData = new FormData();
  //     formData.append('name', eventName);
  //     formData.append('eventType', eventType);
  //     formData.append('sports', JSON.stringify(selectedSports.map(s => s.value)));
  //     formData.append('teams', JSON.stringify(selectedTeams.map(t => t.value)));
  //     formData.append('pointingSystem', selectedSystem.value);
  //     formData.append('hasJokerFeature', hasJoker);
  //     formData.append('startDate', startDate);
  //     formData.append('endDate', endDate);
      
  //     if (poster) {
  //       formData.append('poster', poster);
  //     }

  //     const res = await api.post('/events', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
      
  //     alert('Event created successfully!');
  //     navigate(`/admin/events/${res.data._id}`);
      
  //   } catch (err) {
  //     console.error('Failed to create event', err);
  //     alert('Error: ' + (err.response?.data?.message || 'Failed to create event'));
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-lg">Loading form data...</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Event</h1>
        
        {/* Event Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Name *</label>
              <input 
                type="text" 
                placeholder="e.g., Indoor Sphurti 2025"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Type *</label>
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sphurti">Sphurti (Multi-Sport)</option>
                <option value="VPL">VPL (League)</option>
                <option value="VCL">VCL (League)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Dates *</label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Poster & Settings */}
          <div className="space-y-6">
            {/* Poster Upload */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Poster</label>
              <div className="space-y-4">
                {posterPreview && (
                  <div className="text-center">
                    <img 
                      src={posterPreview} 
                      alt="Poster preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-500 mt-2">Preview</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500">Recommended: 16:9 ratio, max 5MB</p>
              </div>
            </div>

            {/* Pointing System */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Pointing System *</label>
              <Select
                options={allSystems}
                value={selectedSystem}
                onChange={setSelectedSystem}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Choose a pointing system..."
                required
              />
            </div>

            {/* Joker Feature */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="joker"
                  checked={hasJoker}
                  onChange={(e) => setHasJoker(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="joker" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Joker Feature for this event
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Allows teams to play a joker match for double points
              </p>
            </div>
          </div>
        </div>

        {/* Sports and Teams Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Participating Sports</label>
            <Select
              isMulti
              options={allSports}
              value={selectedSports}
              onChange={setSelectedSports}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select sports..."
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Participating Teams</label>
            <Select
              isMulti
              options={allTeams}
              value={selectedTeams}
              onChange={setSelectedTeams}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select teams..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Event...
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventCreatePage;