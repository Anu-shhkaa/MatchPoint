import React, { useState, useEffect } from 'react';
import api from '../../services/API_Service';
import Modal from '../../components/common/Modal';
import SportForm from '../../components/admin/SportForm';
import TeamForm from '../../components/admin/TeamForm';
import PointsSystemForm from '../../components/admin/PointsSystemForm';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

const AdminManageDataPage = () => {
  const [activeTab, setActiveTab] = useState('sports');
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genderCategory: '',
    sportType: '',
    teamType: '',
    department: ''
  });

  // Fetch data function
  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      const [sportsRes, teamsRes, systemsRes] = await Promise.all([
        api.get('/data/sports'),
        api.get('/data/teams'), 
        api.get('/data/pointing-systems')
      ]);

      setSports(Array.isArray(sportsRes?.data) ? sportsRes.data : []);
      setTeams(Array.isArray(teamsRes?.data) ? teamsRes.data : []);
      setSystems(Array.isArray(systemsRes?.data) ? systemsRes.data : []);

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load data';
      setError(errorMsg);
      setSports([]);
      setTeams([]);
      setSystems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter and search data
  const getFilteredData = () => {
    let data = [];
    switch (activeTab) {
      case 'sports':
        data = sports;
        break;
      case 'teams':
        data = teams;
        break;
      case 'systems':
        data = systems;
        break;
      default:
        data = [];
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => {
        const searchableFields = activeTab === 'systems' 
          ? [item.systemName]
          : [item.name, item.genderCategory, item.sportType, item.teamType, item.department];
        
        return searchableFields.some(field => 
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply additional filters
    if (filters.genderCategory) {
      data = data.filter(item => item.genderCategory === filters.genderCategory);
    }
    if (filters.sportType) {
      data = data.filter(item => item.sportType === filters.sportType);
    }
    if (filters.teamType) {
      data = data.filter(item => item.teamType === filters.teamType);
    }
    if (filters.department) {
      data = data.filter(item => item.department === filters.department);
    }

    return data;
  };

  // Get unique filter options
  const getFilterOptions = () => {
    switch (activeTab) {
      case 'sports':
        return {
          genderCategory: [...new Set(sports.map(sport => sport.genderCategory))].filter(Boolean),
          sportType: [...new Set(sports.map(sport => sport.sportType))].filter(Boolean)
        };
      case 'teams':
        return {
          teamType: [...new Set(teams.map(team => team.teamType))].filter(Boolean),
          department: [...new Set(teams.map(team => team.department))].filter(Boolean)
        };
      default:
        return {};
    }
  };

  const clearFilters = () => {
    setFilters({
      genderCategory: '',
      sportType: '',
      teamType: '',
      department: ''
    });
    setSearchTerm('');
  };

  // Edit/Delete handlers
  const openEditModal = (itemType, itemData) => {
    setEditingItem({ type: itemType, data: itemData });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDataUpdated = () => {
    fetchData();
    closeEditModal();
  };

  const handleDelete = async (itemType, itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?\nThis action cannot be undone.`)) return;
    try {
      await api.delete(`/data/${itemType}/${itemId}`);
      alert(`"${itemName}" has been deleted successfully.`);
      fetchData();
    } catch (err) {
      console.error(`Delete failed:`, err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Tab Button Component
  const TabButton = ({ tabName, label, count }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        clearFilters();
      }}
      className={`relative px-6 py-3 font-medium transition-all duration-200 border-b-2 flex items-center space-x-2 ${
        activeTab === tabName
          ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-1 text-xs rounded-full min-w-6 flex items-center justify-center ${
          activeTab === tabName 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex space-x-1 mb-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Card component for items
  const ItemCard = ({ item, type, onEdit, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false);

    const getItemDetails = () => {
      switch (type) {
        case 'sports':
          return (
            <>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{item.name}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Category:</span> {item.genderCategory}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {item.sportType}
                </p>
                {showDetails && item.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    <span className="font-medium">Description:</span> {item.description}
                  </p>
                )}
              </div>
            </>
          );
        case 'teams':
          return (
            <>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{item.name}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {item.teamType}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Department:</span> {item.department}
                </p>
                {showDetails && item.coach && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Coach:</span> {item.coach}
                  </p>
                )}
              </div>
            </>
          );
        case 'systems':
          return (
            <>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{item.systemName}</h3>
              <div className="space-y-1 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Win:</span> {item.points?.win || 0} pts
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Loss:</span> {item.points?.loss || 0} pts
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Draw:</span> {item.points?.draw || 0} pts
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">No Result:</span> {item.points?.noResult || 0} pts
                  </p>
                  {item.points?.tie !== undefined && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Tie:</span> {item.points?.tie || 0} pts
                    </p>
                  )}
                </div>
                {showDetails && item.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                    {item.description}
                  </p>
                )}
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800">
        {getItemDetails()}
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex-1 justify-center"
          >
            {showDetails ? <EyeSlashIcon className="w-4 h-4 mr-1" /> : <EyeIcon className="w-4 h-4 mr-1" />}
            {showDetails ? 'Less' : 'More'}
          </button>
          <button 
            onClick={onEdit}
            className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex-1 justify-center"
          >
            <PencilSquareIcon className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200 flex-1 justify-center"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Empty state component
  const EmptyState = ({ message, onClearFilters, hasFilters }) => (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <PlusIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {hasFilters ? 'No matching items found' : 'No items found'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );

  const filteredData = getFilteredData();
  const filterOptions = getFilterOptions();
  const hasActiveFilters = searchTerm || Object.values(filters).some(filter => filter !== '');

  // Render content based on active tab
  const renderTabContent = () => {
    const getEmptyMessage = () => {
      switch (activeTab) {
        case 'sports': return 'No sports found. Add your first sport using the form above.';
        case 'teams': return 'No teams found. Add your first team using the form above.';
        case 'systems': return 'No pointing systems found. Add your first system using the form above.';
        default: return 'No items found.';
      }
    };

    return (
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors duration-200"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filterOptions.genderCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender Category
                    </label>
                    <select
                      value={filters.genderCategory}
                      onChange={(e) => setFilters(prev => ({ ...prev, genderCategory: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {filterOptions.genderCategory.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                )}

                {filterOptions.sportType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sport Type
                    </label>
                    <select
                      value={filters.sportType}
                      onChange={(e) => setFilters(prev => ({ ...prev, sportType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {filterOptions.sportType.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}

                {filterOptions.teamType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Team Type
                    </label>
                    <select
                      value={filters.teamType}
                      onChange={(e) => setFilters(prev => ({ ...prev, teamType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {filterOptions.teamType.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}

                {filterOptions.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Departments</option>
                      {filterOptions.department.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredData.length} of{' '}
              {activeTab === 'sports' ? sports.length : activeTab === 'teams' ? teams.length : systems.length}{' '}
              {activeTab}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-blue-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {activeTab === 'sports' && 'Add New Sport'}
            {activeTab === 'teams' && 'Add New Team'}
            {activeTab === 'systems' && 'Add New Pointing System'}
          </h2>
          {activeTab === 'sports' && <SportForm onDataAdded={fetchData} isEditMode={false} />}
          {activeTab === 'teams' && <TeamForm onDataAdded={fetchData} isEditMode={false} />}
          {activeTab === 'systems' && <PointsSystemForm onDataAdded={fetchData} isEditMode={false} />}
        </div>

        {/* Data Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Existing {activeTab === 'sports' ? 'Sports' : activeTab === 'teams' ? 'Teams' : 'Pointing Systems'} 
            </h2>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {filteredData.length === 0 ? (
            <EmptyState 
              message={getEmptyMessage()} 
              onClearFilters={clearFilters}
              hasFilters={hasActiveFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(item => (
                <ItemCard
                  key={item._id}
                  item={item}
                  type={activeTab}
                  onEdit={() => openEditModal(
                    activeTab === 'systems' ? 'pointingsystems' : activeTab,
                    item
                  )}
                  onDelete={() => handleDelete(
                    activeTab === 'systems' ? 'pointingsystems' : activeTab,
                    item._id,
                    activeTab === 'systems' ? item.systemName : item.name
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Master Data
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage sports, teams, and pointing systems
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <div className="flex min-w-max">
            <TabButton 
              tabName="sports" 
              label="Sports" 
              count={sports.length} 
            />
            <TabButton 
              tabName="teams" 
              label="Teams" 
              count={teams.length} 
            />
            <TabButton 
              tabName="systems" 
              label="Pointing Systems" 
              count={systems.length} 
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6">
            {error ? (
              <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-500 text-xl font-bold">!</span>
                </div>
                <p className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                  Error Loading Data
                </p>
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button 
                  onClick={fetchData} 
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>

        {/* Edit Modal */}
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={closeEditModal} 
          title={`Edit ${editingItem?.type === 'pointingsystems' ? 'Pointing System' : editingItem?.type || 'Item'}`}
          size="lg"
        >
          {editingItem?.type === 'sports' && (
            <SportForm 
              initialData={editingItem.data} 
              onDataAdded={handleDataUpdated} 
              isEditMode={true} 
            />
          )}
          {editingItem?.type === 'teams' && (
            <TeamForm 
              initialData={editingItem.data} 
              onDataAdded={handleDataUpdated} 
              isEditMode={true} 
            />
          )}
          {editingItem?.type === 'pointingsystems' && (
            <PointsSystemForm 
              initialData={editingItem.data} 
              onDataAdded={handleDataUpdated} 
              isEditMode={true} 
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminManageDataPage;