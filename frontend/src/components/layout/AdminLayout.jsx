import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/solid';

// This is the sidebar from your mockup
const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin-login'); // Redirect to login page after logout
  };
  
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center px-4 py-3 rounded-lg";
    const activeClasses = "bg-primary-DEFAULT text-white";
    const inactiveClasses = "text-blue-100 hover:bg-primary-dark hover:text-white";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar (from your mockup) */}
      <nav className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8 text-center">
          MatchPoint Admin
        </div>
        
        <div className="flex-grow space-y-2">
          <NavLink to="/admin/dashboard" className={getNavLinkClass}>
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/event/new" className={getNavLinkClass}>
            <CalendarDaysIcon className="h-5 w-5 mr-3" />
            Create Event
          </NavLink>
          <NavLink to="/admin/manage-data" className={getNavLinkClass}>
            <ShieldCheckIcon className="h-5 w-5 mr-3" />
            Manage Data
          </NavLink>
        </div>
        
        <div className="space-y-2">
          <NavLink to="/admin/settings" className={getNavLinkClass}>
            <CogIcon className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* This Outlet renders the child admin pages 
            (AdminDashboard, AdminCreateEvent, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
