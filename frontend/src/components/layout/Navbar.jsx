import React from 'react';
import { Link } from 'react-router-dom';
// --- Use correct import path ---
import { useTheme } from '../../context/ThemeContext';
// --- End Use correct import path ---
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // Updated color scheme to match admin dashboard
    <nav className="bg-gray-800 dark:bg-gray-900 shadow-lg sticky top-0 z-40 transition-colors duration-300 border-b border-gray-700 dark:border-gray-600">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-gray-200 transition-colors duration-200">
          MatchPoint
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          // Updated button colors to match admin theme
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-900 focus:ring-blue-400 border border-gray-600 dark:border-gray-700"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-5 w-5" /> // Moon icon for switching to dark
          ) : (
            <SunIcon className="h-5 w-5" /> // Sun icon for switching to light
          )}
          {/* Optional: Add text label for clarity */}
          <span className="text-sm hidden sm:inline">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </nav>
  );
};

// Keep the default export as you defined it
export default Navbar;