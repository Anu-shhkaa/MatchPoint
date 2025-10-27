import React, { useEffect, useState } from 'react';
import api from '../../services/API_Service';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  PlusIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  TrophyIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/solid';

// Updated StatCard to match the blue theme
const StatCard = ({ title, value, linkTo, icon: Icon, gradient }) => (
  <Link 
    to={linkTo} 
    className="group bg-gradient-to-br from-blue-900/40 to-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-blue-800/30 shadow-lg hover:shadow-xl hover:border-blue-600/50 transition-all duration-300 hover:scale-105"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-blue-200/80 mb-2">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${gradient} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-blue-300/60 group-hover:text-blue-200 transition-colors">View Details</span>
      <ArrowRightIcon className="h-4 w-4 text-blue-400 transform group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    teams: 0,
    sports: 0,
    pointingSystems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, teamsRes, sportsRes, systemsRes] = await Promise.all([
          api.get('/events'),
          api.get('/data/teams'),
          api.get('/data/sports'),
          api.get('/data/pointing-systems')
        ]);
        setStats({
          events: eventsRes.data.length,
          teams: teamsRes.data.length,
          sports: sportsRes.data.length,
          pointingSystems: systemsRes.data.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Loading skeleton that matches the theme
  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-blue-800/30 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/30">
              <div className="h-4 bg-blue-800/30 rounded w-24 mb-4"></div>
              <div className="h-8 bg-blue-800/30 rounded w-16 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-blue-800/30 rounded w-20"></div>
                <div className="h-4 bg-blue-800/30 rounded w-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-blue-200/70 font-light">
          Welcome back! Here's what's happening with your sports management system.
        </p>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Events" 
          value={stats.events} 
          linkTo="/admin/events"
          icon={CalendarDaysIcon}
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        <StatCard 
          title="Total Teams" 
          value={stats.teams} 
          linkTo="/admin/manage-data"
          icon={UserGroupIcon}
          gradient="bg-gradient-to-br from-green-600 to-green-700"
        />
        <StatCard 
          title="Total Sports" 
          value={stats.sports} 
          linkTo="/admin/manage-data"
          icon={TrophyIcon}
          gradient="bg-gradient-to-br from-purple-600 to-purple-700"
        />
        <StatCard 
          title="Pointing Systems" 
          value={stats.pointingSystems} 
          linkTo="/admin/manage-data"
          icon={Cog6ToothIcon}
          gradient="bg-gradient-to-br from-orange-600 to-orange-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 backdrop-blur-sm rounded-xl border border-blue-800/30 shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
          <div className="flex items-center gap-2 text-blue-300/60">
            <ClockIcon className="h-4 w-4" />
            <span className="text-sm">Frequently used</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/admin/events/create"
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-blue-500/30"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Create New Event</span>
          </Link>
          <Link 
            to="/admin/manage-data"
            className="flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-800 text-blue-200 px-6 py-3 rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-slate-600/30"
          >
            <span className="font-medium">Manage Sports & Teams</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Placeholder */}
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 backdrop-blur-sm rounded-xl border border-blue-800/30 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <ChartBarIcon className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <span className="text-blue-200">Database Connection</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <span className="text-blue-200">API Services</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Running</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <span className="text-blue-200">User Management</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 backdrop-blur-sm rounded-xl border border-blue-800/30 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">At a Glance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <div className="text-2xl font-bold text-white mb-1">{stats.events}</div>
              <div className="text-xs text-blue-300/70">Active Events</div>
            </div>
            <div className="text-center p-4 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <div className="text-2xl font-bold text-white mb-1">{stats.teams}</div>
              <div className="text-xs text-blue-300/70">Registered Teams</div>
            </div>
            <div className="text-center p-4 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <div className="text-2xl font-bold text-white mb-1">{stats.sports}</div>
              <div className="text-xs text-blue-300/70">Sports Types</div>
            </div>
            <div className="text-center p-4 bg-blue-800/20 rounded-lg border border-blue-700/30">
              <div className="text-2xl font-bold text-white mb-1">{stats.pointingSystems}</div>
              <div className="text-xs text-blue-300/70">Scoring Systems</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;