import React, { useState, useEffect } from 'react';
// --- Ensure correct import name ---
import api from '../../services/API_Service';
// --- End Ensure ---
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

// Accept initialData and isEditMode props
const PointsSystemForm = ({ onDataAdded, initialData = null, isEditMode = false }) => {
  // State for form fields
  const [systemName, setSystemName] = useState('');
  // Initialize levels state with a default structure or from initialData
  const [levels, setLevels] = useState([
    { levelName: 'Winner', achievementLevel: 5, points: 0 },
    { levelName: 'RunnerUp', achievementLevel: 4, points: 0 },
    { levelName: 'SemiFinalist', achievementLevel: 3, points: 0 },
    { levelName: 'Participation', achievementLevel: 1, points: 0 },
  ]);
  // State for error messages and loading indicator
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to prefill the form when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setSystemName(initialData.systemName || '');
      // Ensure levels is a valid array before setting state, provide default if not
      setLevels(Array.isArray(initialData.levels) && initialData.levels.length > 0 ? initialData.levels : [
        { levelName: 'Winner', achievementLevel: 5, points: 0 }, // Default structure
      ]);
    } else {
      // Reset form fields if not editing or initialData is cleared
      setSystemName('');
      setLevels([ // Reset to default levels structure
        { levelName: 'Winner', achievementLevel: 5, points: 0 },
        { levelName: 'RunnerUp', achievementLevel: 4, points: 0 },
        { levelName: 'SemiFinalist', achievementLevel: 3, points: 0 },
        { levelName: 'Participation', achievementLevel: 1, points: 0 },
      ]);
    }
  }, [isEditMode, initialData]); // Rerun effect if mode or data changes

  // Handle changes in the dynamic 'levels' array inputs
  const handleLevelChange = (index, field, value) => {
    // Create a new array with updated values immutably
    const newLevels = levels.map((level, i) => {
      if (i === index) {
        // Ensure numeric fields are stored as numbers
        const numericValue = (field === 'points' || field === 'achievementLevel') ? Number(value) : value;
        return { ...level, [field]: numericValue };
      }
      return level;
    });
    setLevels(newLevels);
  };

  // Add a new empty level row to the form
  const addLevel = () => {
    // Add a unique key later if needed, for now index is okay for controlled forms
    setLevels([...levels, { levelName: '', achievementLevel: 0, points: 0 }]);
  };

  // Remove a level row by its index
  const removeLevel = (index) => {
    if (levels.length <= 1) return; // Prevent removing the last level
    setLevels(levels.filter((_, i) => i !== index)); // Filter out the level at the given index
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser submit
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    // Basic Validation: Check name and ensure all levels have valid details
    if (!systemName || levels.some(l => !l.levelName || l.achievementLevel <= 0 || l.points < 0)) {
        setError('Please provide a system name and valid details for all levels (Name required, Rank > 0, Points >= 0).');
        setLoading(false);
        return;
    }

    try {
      if (isEditMode && initialData?._id) { // Check if editing and have an ID
        // Call backend PUT route (ensure PUT /api/data/pointingsystems/:id exists)
        await api.put(`/data/pointing-systems/${initialData._id}`, { systemName, levels });
        alert(`System "${systemName}" updated successfully!`);
      } else {
        // Call backend POST route
        await api.post('/data/pointing-systems', { systemName, levels });
        alert(`System "${systemName}" added successfully!`);
      }
      onDataAdded(); // Callback to refresh the list in AdminManageDataPage

      // Reset form fields only if we were adding a new system
      if (!isEditMode) {
          setSystemName('');
          setLevels([
             { levelName: 'Winner', achievementLevel: 5, points: 0 },
             { levelName: 'RunnerUp', achievementLevel: 4, points: 0 },
             { levelName: 'SemiFinalist', achievementLevel: 3, points: 0 },
             { levelName: 'Participation', achievementLevel: 1, points: 0 },
          ]);
      }
    } catch (err) {
      // Handle API errors
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} system`, err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} pointing system.`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // --- Render the form ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md mb-6 bg-gray-50 dark:bg-gray-800 shadow-sm">
      {/* Display error message if present */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* System Name Input */}
      <div>
        <label htmlFor="systemName" className="label-style">System Name *</label>
        <input
          id="systemName"
          type="text"
          placeholder="e.g., Sphurti 2025 System"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          className="input-field" // Use theme input style
          required
        />
      </div>

      {/* Point Levels Section */}
      <div>
        <h3 className="font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary">Point Levels *</h3>
        <div className="space-y-3">
          {/* Map over the levels state to render input rows */}
          {levels.map((level, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 items-center p-2 border rounded dark:border-gray-700">
              {/* Level Name Input */}
              <div className="w-full sm:flex-grow">
                 <label htmlFor={`levelName-${index}`} className="label-style text-xs">Level Name</label>
                 <input
                  id={`levelName-${index}`}
                  type="text"
                  placeholder="e.g., Winner"
                  value={level.levelName}
                  onChange={(e) => handleLevelChange(index, 'levelName', e.target.value)}
                  className="input-field text-sm" // Smaller text for density
                  required
                />
              </div>
              {/* Achievement Level (Rank) Input */}
               <div className="w-full sm:w-1/4">
                 <label htmlFor={`achLevel-${index}`} className="label-style text-xs">Rank</label>
                 <input
                  id={`achLevel-${index}`}
                  type="number"
                  placeholder="e.g., 5"
                  value={level.achievementLevel}
                  min="1" // Rank must be positive
                  onChange={(e) => handleLevelChange(index, 'achievementLevel', e.target.value)}
                  className="input-field text-sm"
                  required
                />
               </div>
              {/* Points Input */}
               <div className="w-full sm:w-1/4">
                 <label htmlFor={`points-${index}`} className="label-style text-xs">Points</label>
                 <input
                  id={`points-${index}`}
                  type="number"
                  placeholder="e.g., 200"
                  value={level.points}
                  min="0" // Points cannot be negative
                  onChange={(e) => handleLevelChange(index, 'points', e.target.value)}
                  className="input-field text-sm"
                  required
                />
               </div>
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeLevel(index)}
                className="btn-danger p-2 mt-4 sm:mt-0 self-end sm:self-center" // Adjust alignment/margin
                title="Remove Level"
                disabled={levels.length <= 1} // Disable if only one level left
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Level Button */}
      <button
        type="button"
        onClick={addLevel}
        className="btn-secondary flex items-center gap-1 text-sm py-1 px-2" // Smaller button
      >
        <PlusIcon className="h-4 w-4" /> Add Level
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary w-full sm:w-auto mt-4" // Add margin top
        disabled={loading} // Disable while loading
      >
        {/* Change button text based on mode and loading state */}
        {loading ? 'Saving...' : (isEditMode ? 'Update System' : 'Save System')}
      </button>
    </form>
  );
};

export default PointsSystemForm;

