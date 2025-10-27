import React from 'react';
import { Link } from 'react-router-dom';
// --- Use correct import path ---
import { useTheme } from '../../context/ThemeContext';
// --- End Use correct import path ---
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // Use direct Tailwind colors with dark: prefix
    // Example: Using a medium blue for light mode, slightly darker blue for dark mode
    <nav className="bg-blue-600 dark:bg-blue-700 shadow-md sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          MatchPoint
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          // Use direct Tailwind colors for the button background and hover
          // Example: Using a lighter blue for light mode, slightly darker for dark
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 dark:focus:ring-offset-blue-700 focus:ring-white"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-5 w-5" /> // Moon icon for switching to dark
          ) : (
            <SunIcon className="h-5 w-5" /> // Sun icon for switching to light
          )}
           {/* Optional: Add text label for clarity */}
           {/* <span className="text-sm hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span> */}
        </button>
      </div>
    </nav>
  );
};

// Keep the default export as you defined it
export default Navbar;