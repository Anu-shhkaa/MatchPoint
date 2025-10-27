import React, { useEffect, useState } from 'react';
import api from '../../services/API_Service';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/solid';

// This will be a reusable component: /components/admin/StatCard.jsx
const StatCard = ({ title, value, linkTo }) => (
  <Link 
    to={linkTo} 
    className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">{title}</p>
    <p className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">{value}</p>
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
        // We'll use the "data" routes we created in the backend
        // const [eventsRes, teamsRes, sportsRes, systemsRes] = await Promise.all([
        //   api.get('/api/events'), // You'll need to create this route
        //   api.get('/api/data/teams'),
        //   api.get('/api/data/sports'),
        //   api.get('/api/data/pointingsystems')
        // ]);
        const [eventsRes, teamsRes, sportsRes, systemsRes] = await Promise.all([
        api.get('/events'),                    // NOT /api/events
        api.get('/data/teams'),                // NOT /api/data/teams
        api.get('/data/sports'),               // NOT /api/data/sports  
        api.get('/data/pointing-systems')      // NOT /api/data/pointingsystems
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

  if (loading) {
    return <div>Loading dashboard...</div>; // Replace with <Spinner />
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Events" value={stats.events} linkTo="/admin/events" />
        <StatCard title="Total Teams" value={stats.teams} linkTo="/admin/manage-data" />
        <StatCard title="Total Sports" value={stats.sports} linkTo="/admin/manage-data" />
        <StatCard title="Pointing Systems" value={stats.pointingSystems} linkTo="/admin/manage-data" />
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/admin/events/create" // You'll create this page
            className="flex items-center gap-2 bg-primary-DEFAULT text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Event
          </Link>
          <Link 
            to="/admin/manage-data"
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Manage Sports & Teams
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* You could add a list of "Recent Events" or "Live Matches" here */}
    </div>
  );
};

export default AdminDashboard;
