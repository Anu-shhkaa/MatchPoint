import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Get the login function
import { useNavigate } from 'react-router-dom';
import api from '../../services/API_Service'; // Get our new api service

const AdminLoginPage = () => {
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // The login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Call your backend's "verify-code" route
      const response = await api.post('/auth/verify-code', {
        secretCode: secretCode,
      });

      // 2. The backend sends back a JWT token.
      // We pass this token to our login() function from AuthContext.
      const { token } = response.data;
      login(token); // This saves the token to localStorage and state

      // 3. Send the admin to their dashboard
      navigate('/admin/dashboard');

    } catch (err) {
      console.error(err);
      setError('Invalid Secret Code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <form 
        onSubmit={handleSubmit}
        className="p-8 bg-surface-light dark:bg-surface-dark rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center text-text-light-primary dark:text-text-dark-primary mb-6">
          Admin Access
        </h1>
        
        <div className="mb-4">
          <label 
            htmlFor="secretCode" 
            className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2"
          >
            Secret Code
          </label>
          <input
            type="password"
            id="secretCode"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary-DEFAULT"
            required
          />
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary-DEFAULT text-white py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
