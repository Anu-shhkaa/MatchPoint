import React, { useState, useEffect } from 'react';
// --- Ensure correct import name ---
import api from '../../services/API_Service'; 
// --- End Ensure ---

// Accept initialData and isEditMode as props from AdminManageDataPage
const SportForm = ({ onDataAdded, initialData = null, isEditMode = false }) => {
  // State for form fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Boys');
  // State for error messages and loading indicator
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect Hook: This runs when the component loads or when isEditMode/initialData changes
  useEffect(() => {
    // If we are in edit mode AND we received data for the sport being edited...
    if (isEditMode && initialData) {
      // ...pre-fill the form fields with the existing data.
      setName(initialData.name || ''); // Use default empty string if name is missing
      setGender(initialData.genderCategory || 'Boys'); // Use default if gender is missing
    } else {
      // If not editing (i.e., adding a new sport), make sure the form is empty.
      setName('');
      setGender('Boys');
    }
    // Dependency array: Tells React to re-run this effect if these props change
  }, [isEditMode, initialData]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError(''); // Clear any previous error messages
    setLoading(true); // Show loading indicator on the button
    try {
      // Check if we are editing an existing sport
      if (isEditMode && initialData?._id) { // Check if we have an ID to update
        // Send a PUT request to the backend update route
        // (Ensure PUT /api/data/sports/:id exists in your backend)
        await api.put(`/data/sports/${initialData._id}`, { name, genderCategory: gender });
        alert(`Sport "${name}" updated successfully!`);
      } else {
        // If not editing, send a POST request to create a new sport
        await api.post('/data/sports', { name, genderCategory: gender });
        alert(`Sport "${name}" added successfully!`);
      }
      onDataAdded(); // Call the function passed from AdminManageDataPage to refresh the list
      
      // Reset the form fields ONLY if we were adding a new sport
      if (!isEditMode) {
          setName('');
          setGender('Boys');
      }
    } catch (err) {
      // Handle errors from the API call
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} sport`, err);
      // Display a user-friendly error message
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} sport. Please try again.`);
    } finally {
      setLoading(false); // Hide loading indicator, whether success or error
    }
  };

  // --- Render the form ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md mb-6 bg-gray-50 dark:bg-gray-800 shadow-sm">
      {/* Display error message if it exists */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      {/* Layout for form fields and button */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {/* Sport Name Input */}
        <div className="flex-grow w-full"> {/* Take up available space */}
           <label htmlFor="sportName" className="label-style">Sport Name *</label>
           <input
            id="sportName"
            type="text"
            placeholder="Sport Name (e.g., Chess)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field" // Use theme input style
            required // Make field required
          />
        </div>
        {/* Gender Select */}
        <div className="w-full sm:w-auto"> {/* Adjust width */}
          <label htmlFor="sportGender" className="label-style">Category *</label>
          <select
            id="sportGender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field" // Use theme input style
          >
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-primary w-full sm:w-auto" // Use theme button style
          disabled={loading} // Disable button while loading
        >
          {/* Change button text based on mode and loading state */}
          {loading ? 'Saving...' : (isEditMode ? 'Update Sport' : 'Add Sport')}
        </button>
      </div>
    </form>
  );
};

export default SportForm;

