import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // 1. Import your hook
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Needs: npm install @heroicons/react

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // 2. Get theme and toggle function

  return (
    <nav className="bg-primary-DEFAULT p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">MatchPoint</h1>
      
      {/* 3. The Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-primary-dark text-white"
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6" /> // Show moon when light
        ) : (
          <SunIcon className="h-6 w-6" /> // Show sun when dark
        )}
      </button>
    </nav>
  );
};

export default Navbar;
