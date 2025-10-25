import React, { useState } from 'react';
import api from '../../services/API_Service';
import { useParams } from 'react-router-dom';

const AdminJokerLogicPage = () => {
  const { eventId } = useParams(); // Get eventId from the URL
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file to upload.');
    
    const formData = new FormData();
    formData.append('jokerFile', file);
    
    setUploading(true);
    try {
      // Use the 'jokerRoutes.js' endpoint
      const res = await api.post(`/api/joker/${eventId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.response?.data?.message || 'File upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const runFinalCalculation = async () => {
    if (!window.confirm('Are you sure? This will finalize the points table and cannot be undone.')) {
      return;
    }
    
    setCalculating(true);
    try {
      // Use the 'jokerRoutes.js' endpoint
      const res = await api.post(`/api/joker/${eventId}/calculate`);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.response?.data?.message || 'Calculation failed.'));
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Apply Joker Logic</h1>
      <p>This process is final and should only be run ONCE after all matches are completed.</p>
      
      {/* Step 1: Upload */}
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <h2 className="text-xl font-bold mb-4">Step 1: Upload Joker Submissions</h2>
        <p className="mb-2">Download the template, fill it, and upload it.</p>
        <a 
          href="/joker-template.xlsx" // This must be in your /frontend/public folder
          download 
          className="text-blue-500 hover:underline"
        >
          Download Template
        </a>
        
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".xlsx, .xls" 
          className="block mt-4" 
        />
        
        <button 
          onClick={handleUpload} 
          disabled={uploading} 
          className="btn-primary mt-4"
        >
          {uploading ? 'Uploading...' : 'Upload Submissions'}
        </button>
      </div>

      {/* Step 2: Calculate */}
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-md shadow">
        <h2 className="text-xl font-bold mb-4">Step 2: Run Final Calculation</h2>
        <p className="mb-4">This will compare all results and apply joker points where applicable. This can take a moment.</p>
        <button 
          onClick={runFinalCalculation} 
          disabled={calculating} 
          className="btn-danger"
        >
          {calculating ? 'Calculating...' : 'Run Final Joker Calculation'}
        </button>
      </div>
    </div>
  );
};

export default AdminJokerLogicPage;
