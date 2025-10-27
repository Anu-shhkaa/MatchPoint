import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, PlayIcon, Bars3Icon } from '@heroicons/react/24/solid';

const Footer = () => {
  const location = useLocation();
  
  const getNavLinkClass = (path) => {
    const base = "flex flex-col items-center justify-center flex-1 p-2 transition duration-200";
    const isActive = location.pathname === path;
    
    if (isActive) {
      return `${base} text-blue-600 dark:text-blue-400 font-semibold`;
    } else {
      return `${base} text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300`;
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-50 md:hidden">
      <NavLink to="/" className={getNavLinkClass('/')}>
        <HomeIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </NavLink>
      
      <NavLink to="/events" className={getNavLinkClass('/events')}>
        <CalendarDaysIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Events</span>
      </NavLink>
      
      <NavLink to="/matches/live" className={getNavLinkClass('/matches/live')}>
        <PlayIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Live</span>
      </NavLink>
      
      <NavLink to="/more" className={getNavLinkClass('/more')}>
        <Bars3Icon className="h-6 w-6" />
        <span className="text-xs mt-1">More</span>
      </NavLink>
    </footer>
  );
};

export default Footer;