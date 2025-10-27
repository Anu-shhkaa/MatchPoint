import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { PlusIcon, CalendarDaysIcon, PhotoIcon, TrophyIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';

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
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }
      
      setPoster(file);
      const previewUrl = URL.createObjectURL(file);
      setPosterPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

      console.log('📤 Sending event data...');
      const res = await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Event created successfully!');
      navigate(`/admin/events/${res.data._id}`);
      
    } catch (err) {
      console.error('❌ Failed to create event:', err);
      alert('Error: ' + (err.response?.data?.message || 'Failed to create event'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      <span className="ml-3 text-lg text-blue-200">Loading form data...</span>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
          <PlusIcon className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
          <p className="text-blue-200/70 text-lg">
            Set up a new sports event with teams, sports, and scoring systems
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Basic Info */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Event Name */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <TrophyIcon className="h-5 w-5 text-blue-400" />
                <label className="block text-lg font-semibold text-blue-200">Event Name *</label>
              </div>
              <input 
                type="text" 
                placeholder="e.g., Indoor Sphurti 2025"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-4 py-3 border border-blue-700/30 rounded-lg bg-slate-800/50 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Event Type */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Cog6ToothIcon className="h-5 w-5 text-blue-400" />
                <label className="block text-lg font-semibold text-blue-200">Event Type *</label>
              </div>
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-3 border border-blue-700/30 rounded-lg bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="Sphurti" className="bg-slate-800 text-white">Sphurti (Multi-Sport)</option>
                <option value="VPL" className="bg-slate-800 text-white">VPL (League)</option>
                <option value="VCL" className="bg-slate-800 text-white">VCL (League)</option>
                <option value="Other" className="bg-slate-800 text-white">Other</option>
              </select>
            </div>

            {/* Event Dates */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDaysIcon className="h-5 w-5 text-blue-400" />
                <label className="block text-lg font-semibold text-blue-200">Event Dates *</label>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-700/30 rounded-lg bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-700/30 rounded-lg bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Poster & Settings */}
          <div className="space-y-6">
            {/* Poster Upload */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <PhotoIcon className="h-5 w-5 text-blue-400" />
                <label className="block text-lg font-semibold text-blue-200">Event Poster</label>
              </div>
              <div className="space-y-4">
                {posterPreview && (
                  <div className="text-center">
                    <img 
                      src={posterPreview} 
                      alt="Poster preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-lg border border-blue-600/30"
                    />
                    <p className="text-sm text-blue-300/70 mt-2">Preview</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="block w-full text-sm text-blue-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors cursor-pointer"
                />
                <p className="text-xs text-blue-300/70">Recommended: 16:9 ratio, max 5MB</p>
              </div>
            </div>

            {/* Pointing System */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <ChartBarIcon className="h-5 w-5 text-blue-400" />
                <label className="block text-lg font-semibold text-blue-200">Select Pointing System *</label>
              </div>
              <Select
                options={allSystems}
                value={selectedSystem}
                onChange={setSelectedSystem}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Choose a pointing system..."
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#1e293b',
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '6px',
                    '&:hover': {
                      borderColor: 'rgba(59, 130, 246, 0.5)'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#334155' : '#1e293b',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#334155'
                    }
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'white'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(147, 197, 253, 0.5)'
                  }),
                  input: (base) => ({
                    ...base,
                    color: 'white'
                  })
                }}
              />
            </div>

            {/* Joker Feature */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="checkbox"
                    id="joker"
                    checked={hasJoker}
                    onChange={(e) => setHasJoker(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-blue-700/30 bg-slate-800"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="joker" className="block text-lg font-semibold text-blue-200 mb-2">
                    Enable Joker Feature
                  </label>
                  <p className="text-sm text-blue-300/70">
                    Allows teams to play a joker match for double points. This adds strategic depth to the tournament.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sports and Teams Selection */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Sports Selection */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrophyIcon className="h-5 w-5 text-blue-400" />
              <label className="block text-lg font-semibold text-blue-200">Select Participating Sports</label>
            </div>
            <Select
              isMulti
              options={allSports}
              value={selectedSports}
              onChange={setSelectedSports}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select sports..."
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#1e293b',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '4px',
                  '&:hover': {
                    borderColor: 'rgba(59, 130, 246, 0.5)'
                  }
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#334155' : '#1e293b',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#334155'
                  }
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#334155'
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white'
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: '#93c5fd',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                    color: 'white'
                  }
                }),
                placeholder: (base) => ({
                  ...base,
                  color: 'rgba(147, 197, 253, 0.5)'
                }),
                input: (base) => ({
                  ...base,
                  color: 'white'
                })
              }}
            />
          </div>

          {/* Teams Selection */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-blue-800/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <UserGroupIcon className="h-5 w-5 text-blue-400" />
              <label className="block text-lg font-semibold text-blue-200">Select Participating Teams</label>
            </div>
            <Select
              isMulti
              options={allTeams}
              value={selectedTeams}
              onChange={setSelectedTeams}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select teams..."
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#1e293b',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '4px',
                  '&:hover': {
                    borderColor: 'rgba(59, 130, 246, 0.5)'
                  }
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#334155' : '#1e293b',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#334155'
                  }
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#334155'
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white'
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: '#93c5fd',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                    color: 'white'
                  }
                }),
                placeholder: (base) => ({
                  ...base,
                  color: 'rgba(147, 197, 253, 0.5)'
                }),
                input: (base) => ({
                  ...base,
                  color: 'white'
                })
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-12 py-4 text-lg rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-3 shadow-lg border border-blue-500/30"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Event...
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Create Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Add missing icons
const ChartBarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
  </svg>
);

export default AdminEventCreatePage;