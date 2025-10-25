import React, { useState } from 'react';
import api from '../../services/API_Service';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const PointsSystemForm = ({ onDataAdded }) => {
  const [systemName, setSystemName] = useState('');
  const [levels, setLevels] = useState([
    { levelName: 'Winner', achievementLevel: 5, points: 0 },
    { levelName: 'RunnerUp', achievementLevel: 4, points: 0 },
  ]);
  const [error, setError] = useState('');

  const handleLevelChange = (index, field, value) => {
    const newLevels = [...levels];
    newLevels[index][field] = value;
    setLevels(newLevels);
  };
  
  const addLevel = () => {
    setLevels([...levels, { levelName: '', achievementLevel: 1, points: 0 }]);
  };
  
  const removeLevel = (index) => {
    setLevels(levels.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/data/pointingsystems', { systemName, levels });
      onDataAdded();
      alert('Pointing System added!');
      // Reset form
      setSystemName('');
      setLevels([{ levelName: 'Winner', achievementLevel: 5, points: 0 }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add system');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="System Name (e.g., Sphurti 2025 System)"
        value={systemName}
        onChange={(e) => setSystemName(e.target.value)}
        className="input-field"
        required
      />
      
      <h3 className="font-bold">Point Levels</h3>
      {levels.map((level, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Level Name (e.g., SemiFinalist)"
            value={level.levelName}
            onChange={(e) => handleLevelChange(index, 'levelName', e.target.value)}
            className="input-field w-1/3"
            required
          />
          <input
            type="number"
            placeholder="Rank (e.g., 3)"
            value={level.achievementLevel}
            onChange={(e) => handleLevelChange(index, 'achievementLevel', e.target.valueAsNumber)}
            className="input-field w-1/4"
            required
          />
          <input
            type="number"
            placeholder="Points (e.g., 100)"
            value={level.points}
            onChange={(e) => handleLevelChange(index, 'points', e.target.valueAsNumber)}
            className="input-field w-1/4"
            required
          />
          <button type="button" onClick={() => removeLevel(index)} className="btn-danger p-2">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
      
      <button type="button" onClick={addLevel} className="btn-secondary flex items-center gap-1">
        <PlusIcon className="h-5 w-5" /> Add Level
      </button>
      
      <button types="submit" className="btn-primary">Save Pointing System</button>
    </form>
  );
};

export default PointsSystemForm;
