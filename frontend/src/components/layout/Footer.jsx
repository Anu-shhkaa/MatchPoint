import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, PlayIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext'; // Import theme hook
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const Footer = () => { // Renamed from ViewerLayout
  const { theme, toggleTheme } = useTheme();

  // This function adds Tailwind classes conditionally
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex flex-col items-center justify-center flex-1 p-2";
    const activeClasses = "text-primary-DEFAULT"; // Your main blue color
    const inactiveClasses = "text-text-light-secondary dark:text-text-dark-secondary";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-light-primary dark:text-text-dark-primary pb-20">
      
      {/* Top Navbar (from your mockup) */}
      <nav className="bg-primary-DEFAULT shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-white text-2xl font-bold">MatchPoint</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary-dark text-white"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </button>
      </nav>
      
      {/* Main Page Content */}
      <main className="p-4">
        {/* This Outlet tells the router where to render the child pages 
            (like HomePage, EventDetailPage) */}
        <Outlet />
      </main>
      
      {/* Footer (Bottom Navbar from your mockup) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-10">
        <NavLink to="/" className={getNavLinkClass}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink to="/events" className={getNavLinkClass}> {/* You'll need to add this route to App.jsx */}
          <CalendarIcon className="h-6 w-6" />
          <span className="text-xs">Events</span>
        </NavLink>
        <NavLink to="/live" className={getNavLinkClass}> {/* You'll need to add this route too */}
          <PlayIcon className="h-6 w-6" />
          <span className="text-xs">Live</span>
        </NavLink>
        <NavLink to="/more" className={getNavLinkClass}> {/* And this one */}
          <Bars3Icon className="h-6 w-6" />
          <span className="text-xs">More</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Footer; // Renamed from ViewerLayout

