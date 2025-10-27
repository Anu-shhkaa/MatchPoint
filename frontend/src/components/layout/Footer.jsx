import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, PlayIcon, Bars3Icon } from '@heroicons/react/24/solid';

const Footer = () => {
  const location = useLocation();
  
  const getNavLinkClass = (path) => {
    const base = "flex flex-col items-center justify-center flex-1 p-2 transition-all duration-300 group";
    const isActive = location.pathname === path;
    
    if (isActive) {
      return `${base} text-blue-400 font-semibold bg-blue-900/30`;
    } else {
      return `${base} text-blue-200/70 hover:text-blue-300 hover:bg-blue-800/20`;
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-t border-blue-800/30 flex justify-around items-center z-50 md:hidden">
      <NavLink to="/" className={getNavLinkClass('/')}>
        <HomeIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs mt-1">Home</span>
      </NavLink>
      
      <NavLink to="/events" className={getNavLinkClass('/events')}>
        <CalendarDaysIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs mt-1">Events</span>
      </NavLink>
      
      <NavLink to="/matches/live" className={getNavLinkClass('/matches/live')}>
        <PlayIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs mt-1">Live</span>
      </NavLink>
      
      <NavLink to="/more" className={getNavLinkClass('/more')}>
        <Bars3Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs mt-1">More</span>
      </NavLink>
    </footer>
  );
};

export default Footer;