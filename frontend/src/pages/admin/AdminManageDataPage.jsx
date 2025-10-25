import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';

// You will create these components in /components/admin/
// I will provide the code for them next.
import SportForm from '../../components/admin/SportForm';
import TeamForm from '../../components/admin/TeamForm';
import PointsSystemForm from '../../components/admin/PointsSystemForm';

const AdminManageDataPage = () => {
  // 'sports', 'teams', or 'systems'
  const [activeTab, setActiveTab] = useState('sports');
  
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [systems, setSystems] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  // This function will re-fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sportsRes, teamsRes, systemsRes] = await Promise.all([
        api.get('/api/data/sports'),
        api.get('/api/data/teams'),
        api.get('/api/data/pointingsystems')
      ]);
      setSports(sportsRes.data);
      setTeams(teamsRes.data);
      setSystems(systemsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);
  
  const renderTabContent = () => {
    if (loading) return <div>Loading...</div>;
    
    switch (activeTab) {
      case 'sports':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Add New Sport</h2>
            <SportForm onDataAdded={fetchData} /> {/* Pass refresh function */}
            <h2 className="text-xl font-bold mt-8 mb-4">Existing Sports</h2>
            <ul className="list-disc pl-5">
              {sports.map(s => <li key={s._id}>{s.name} ({s.genderCategory})</li>)}
            </ul>
          </div>
        );
      case 'teams':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Add New Team</h2>
            <TeamForm onDataAdded={fetchData} />
            <h2 className="text-xl font-bold mt-8 mb-4">Existing Teams</h2>
            <ul className="list-disc pl-5">
              {teams.map(t => <li key={t._id}>{t.name} ({t.teamType})</li>)}
            </ul>
          </div>
        );
      case 'systems':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Add New Pointing System</h2>
            <PointsSystemForm onDataAdded={fetchData} />
            <h2 className="text-xl font-bold mt-8 mb-4">Existing Systems</h2>
            <ul className="pl-5">
              {systems.map(s => <li key={s._id} className="font-bold">{s.systemName}</li>)}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };
  
  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 rounded-t-md ${
        activeTab === tabName 
          ? 'bg-primary-DEFAULT text-white' 
          : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Master Data</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 dark:border-gray-600 mb-6">
        <TabButton tabName="sports" label="Sports" />
        <TabButton tabName="teams" label="Teams" />
        <TabButton tabName="systems" label="Pointing Systems" />
      </div>
      
      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminManageDataPage;
