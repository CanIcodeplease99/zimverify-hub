import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { authAPI } from '../utils/api';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'public',
    organization: '',
    badge_number: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.register(formData);
      alert(`User ${formData.email} created successfully!`);
      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'public',
        organization: '',
        badge_number: '',
      });
    } catch (error) {
      alert('Error creating user: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Register New User</h2>
          <p className="text-gray-600">Create accounts for system users</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="public">Public User</option>
              <option value="police">Police Officer</option>
              <option value="customs">Customs Officer (ZIMRA)</option>
              <option value="interpol">Interpol Officer</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., ZIMRA, ZRP, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge/Employee Number</label>
            <input
              type="text"
              name="badge_number"
              value={formData.badge_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="For police and customs officers"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p className="font-semibold mb-2">Security Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Passwords must be at least 8 characters</li>
            <li>User will receive email with login credentials</li>
            <li>Assign roles carefully - they determine system access levels</li>
            <li>All user creation actions are logged</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRegister;
