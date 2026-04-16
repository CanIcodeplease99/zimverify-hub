import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { statsAPI } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await statsAPI.get();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardCards = () => {
    const roleCards = {
      admin: [
        { title: 'Register User', description: 'Create new system users', path: '/admin/register', color: 'bg-purple-600' },
        { title: 'Vehicle Search', description: 'Search all vehicles', path: '/search', color: 'bg-blue-600' },
        { title: 'Audit Logs', description: 'View system activity', path: '/admin/audit', color: 'bg-gray-600' },
        { title: 'Add Vehicle', description: 'Register imported vehicle', path: '/customs/add-vehicle', color: 'bg-green-600' },
      ],
      customs: [
        { title: 'Add Vehicle', description: 'Register imported vehicle', path: '/customs/add-vehicle', color: 'bg-blue-600' },
        { title: 'Search Vehicles', description: 'Find vehicle records', path: '/search', color: 'bg-green-600' },
        { title: 'My Entries', description: 'View my vehicle entries', path: '/customs/my-entries', color: 'bg-purple-600' },
      ],
      police: [
        { title: 'Interpol Check', description: 'Verify stolen vehicles', path: '/police/interpol', color: 'bg-red-600' },
        { title: 'Vehicle Search', description: 'Search by VIN or Plate', path: '/search', color: 'bg-blue-600' },
      ],
      interpol: [
        { title: 'Flagged Vehicles', description: 'View flagged vehicles', path: '/interpol/flagged', color: 'bg-red-600' },
        { title: 'Search Vehicles', description: 'Search all vehicles', path: '/search', color: 'bg-blue-600' },
        { title: 'Flag Vehicle', description: 'Add Interpol flag', path: '/search', color: 'bg-orange-600' },
      ],
      public: [
        { title: 'Search Vehicles', description: 'Search vehicle information', path: '/search', color: 'bg-blue-600' },
      ],
    };

    return roleCards[user?.role] || [];
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.full_name}</h2>
          <p className="text-gray-600">Role: {user?.role?.toUpperCase()}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-gray-500 text-sm mb-1">Total Vehicles</div>
              <div className="text-3xl font-bold text-primary-600">{stats.total_vehicles?.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-gray-500 text-sm mb-1">Recent Imports (30 days)</div>
              <div className="text-3xl font-bold text-green-600">{stats.recent_imports?.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-gray-500 text-sm mb-1">Flagged Vehicles</div>
              <div className="text-3xl font-bold text-red-600">{stats.flagged_vehicles?.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDashboardCards().map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition text-left`}
            >
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm opacity-90">{card.description}</p>
            </button>
          ))}
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">System Information</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• This system is optimized for tablet and mobile devices</p>
            <p>• All actions are logged for audit purposes</p>
            <p>• Vehicle data is updated in real-time</p>
            {user?.role === 'police' && (
              <p className="font-medium mt-2">• Use Quick Search for fast lookups during traffic stops</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
