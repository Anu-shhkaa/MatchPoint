import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Enhanced NavLink styling with better visual hierarchy
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group";
    const activeClasses = "bg-primary-600 text-white shadow-md shadow-primary-500/25";
    const inactiveClasses = "text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-light-primary dark:hover:text-text-dark-primary hover:translate-x-1";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Mobile sidebar close handler
  const handleMobileNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary transition-colors duration-200">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-surface-light dark:bg-surface-dark shadow-xl z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-gray-200 dark:border-gray-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-6 h-20 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-800 dark:text-primary-200">
                MatchPoint
              </h1>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                Admin Portal
              </p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-2 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-white dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-10 w-10 text-primary-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary truncate">
                {user?.email || 'admin@matchpoint.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
          <NavLink 
            to="/admin/dashboard" 
            className={getNavLinkClass} 
            onClick={handleMobileNavClick}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/events" 
            className={getNavLinkClass} 
            onClick={handleMobileNavClick}
          >
            <CalendarDaysIcon className="h-5 w-5" />
            <span>Manage Events</span>
          </NavLink>
          
          <NavLink 
            to="/admin/events/create" 
            className={getNavLinkClass} 
            onClick={handleMobileNavClick}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Event</span>
          </NavLink>
          
          <NavLink 
            to="/admin/manage-data" 
            className={getNavLinkClass} 
            onClick={handleMobileNavClick}
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span>Manage Data</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-200 group border border-transparent hover:border-red-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <header className="flex justify-between items-center p-4 h-20 bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-800">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Page Title - You can make this dynamic based on current route */}
          <div className="flex-1 md:flex-none">
            <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary ml-4 md:ml-0">
              Admin Dashboard
            </h2>
          </div>

          {/* User Profile/Notifications could go here */}
          <div className="flex items-center gap-4">
            {/* Add notification bell, user menu etc. here */}
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;