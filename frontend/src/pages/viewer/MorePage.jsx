import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, CogIcon } from '@heroicons/react/24/solid';

const MorePage = () => {
  const { token } = useAuth(); // Check if admin is logged in

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">More</h1>
      
      <div className="bg-surface-light dark:bg-surface-dark shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <p>Theme toggle is in the navbar.</p>
        {/* You could add more settings here */}
      </div>

      <div className="bg-surface-light dark:bg-surface-dark shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">About</h2>
        <p>MatchPoint: Live Scores for VESIT</p>
        <p>Built by [Your Name Here]</p>
      </div>

      {/* Show a link to the admin panel if the user is logged in */}
      {token && (
        <Link 
          to="/admin/dashboard" 
          className="flex justify-between items-center w-full p-4 bg-primary-DEFAULT text-white rounded-lg shadow-md"
        >
          <span className="font-bold">Go to Admin Dashboard</span>
          <CogIcon className="h-6 w-6" />
        </Link>
      )}

      {/* Show a link to the admin login if user is NOT logged in */}
      {!token && (
         <Link 
          to="/admin/login" 
          className="flex justify-between items-center w-full p-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-md"
        >
          <span className="font-bold">Admin Login</span>
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
};

export default MorePage;
