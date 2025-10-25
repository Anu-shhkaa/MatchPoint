import React, { useState } from 'react';
import api from '../../services/API_Service';

const SportForm = ({ onDataAdded }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Boys');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/data/sports', { name, genderCategory: gender });
      setName('');
      setGender('Boys');
      onDataAdded(); // Refresh the list on the parent page
      alert('Sport added!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add sport');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Sport Name (e.g., Chess)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field" // You'll style this globally
        required
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="input-field"
      >
        <option value="Boys">Boys</option>
        <option value="Girls">Girls</option>
        <option value="Mixed">Mixed</option>
      </select>
      <button type="submit" className="btn-primary">Add Sport</button>
    </form>
  );
};

export default SportForm;
