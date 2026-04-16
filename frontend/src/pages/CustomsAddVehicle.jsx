import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { vehicleAPI } from '../utils/api';

const CustomsAddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vin: '',
    registration_number: '',
    make: '',
    model: '',
    year: '',
    color: '',
    engine_number: '',
    chassis_number: '',
    import_date: '',
    port_of_entry: '',
    country_of_origin: '',
    customs_entry_number: '',
    importer_name: '',
    importer_id: '',
    current_owner_name: '',
    current_owner_id: '',
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
      // Prepare data
      const submitData = { ...formData };
      submitData.year = parseInt(submitData.year);
      submitData.import_date = new Date(submitData.import_date).toISOString();

      await vehicleAPI.create(submitData);
      alert('Vehicle registered successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error registering vehicle: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Register Imported Vehicle</h2>
          <p className="text-gray-600">Enter complete vehicle and import information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Vehicle Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VIN *</label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Vehicle Identification Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., AAA-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Camry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., White"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
                <input
                  type="text"
                  name="engine_number"
                  value={formData.engine_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
                <input
                  type="text"
                  name="chassis_number"
                  value={formData.chassis_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Import Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Import Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Import Date *</label>
                <input
                  type="date"
                  name="import_date"
                  value={formData.import_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Port of Entry *</label>
                <select
                  name="port_of_entry"
                  value={formData.port_of_entry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Port</option>
                  <option value="Beitbridge">Beitbridge</option>
                  <option value="Chirundu">Chirundu</option>
                  <option value="Forbes">Forbes</option>
                  <option value="Harare Airport">Harare Airport</option>
                  <option value="Kazungula">Kazungula</option>
                  <option value="Kariba">Kariba</option>
                  <option value="Mutare">Mutare</option>
                  <option value="Nyamapanda">Nyamapanda</option>
                  <option value="Plumtree">Plumtree</option>
                  <option value="Victoria Falls">Victoria Falls</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country of Origin *</label>
                <input
                  type="text"
                  name="country_of_origin"
                  value={formData.country_of_origin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Japan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customs Entry Number *</label>
                <input
                  type="text"
                  name="customs_entry_number"
                  value={formData.customs_entry_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., CE-2025-001234"
                />
              </div>
            </div>
          </div>

          {/* Importer Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Importer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importer Name *</label>
                <input
                  type="text"
                  name="importer_name"
                  value={formData.importer_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Full name or company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importer ID</label>
                <input
                  type="text"
                  name="importer_id"
                  value={formData.importer_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="National ID or Company Registration"
                />
              </div>
            </div>
          </div>

          {/* Current Owner Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Current Owner (if different)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Owner Name</label>
                <input
                  type="text"
                  name="current_owner_name"
                  value={formData.current_owner_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Leave blank if same as importer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Owner ID</label>
                <input
                  type="text"
                  name="current_owner_id"
                  value={formData.current_owner_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="National ID"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Vehicle'}
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

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">Important Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All fields marked with * are required</li>
            <li>VIN must be unique - system will reject duplicates</li>
            <li>This record becomes the source of truth for this vehicle</li>
            <li>All actions are logged for audit purposes</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CustomsAddVehicle;
