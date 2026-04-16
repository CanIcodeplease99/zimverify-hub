import React, { useState } from 'react';
import Layout from '../components/Layout';
import { vehicleAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const VehicleSearch = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useState({
    vin: '',
    registration_number: '',
    make: '',
    model: '',
    year: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== '')
      );
      
      const response = await vehicleAPI.search(params);
      setResults(response.data);
    } catch (error) {
      alert('Search failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (vehicleId) => {
    try {
      const response = await vehicleAPI.getById(vehicleId);
      setSelectedVehicle(response.data);
    } catch (error) {
      alert('Error loading vehicle details: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleFlagVehicle = async () => {
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging');
      return;
    }

    try {
      await vehicleAPI.flagInterpol(selectedVehicle.id, flagReason);
      alert('Vehicle flagged successfully');
      setShowFlagModal(false);
      setFlagReason('');
      handleViewDetails(selectedVehicle.id);
    } catch (error) {
      alert('Error flagging vehicle: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleUnflagVehicle = async () => {
    if (!confirm('Remove Interpol flag from this vehicle?')) return;

    try {
      await vehicleAPI.unflagInterpol(selectedVehicle.id);
      alert('Flag removed successfully');
      handleViewDetails(selectedVehicle.id);
    } catch (error) {
      alert('Error removing flag: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      imported: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      transferred: 'bg-purple-100 text-purple-800',
      flagged: 'bg-red-100 text-red-800',
      stolen: 'bg-red-600 text-white',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Vehicle Search</h2>
          <p className="text-gray-600">Search for vehicle information in the system</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                <input
                  type="text"
                  value={searchParams.vin}
                  onChange={(e) => setSearchParams({ ...searchParams, vin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Vehicle Identification Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={searchParams.registration_number}
                  onChange={(e) => setSearchParams({ ...searchParams, registration_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Plate number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                <input
                  type="text"
                  value={searchParams.make}
                  onChange={(e) => setSearchParams({ ...searchParams, make: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Toyota"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  type="text"
                  value={searchParams.model}
                  onChange={(e) => setSearchParams({ ...searchParams, model: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Camry"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={searchParams.year}
                  onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchParams({ vin: '', registration_number: '', make: '', model: '', year: '' });
                  setResults([]);
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Search Results ({results.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">VIN</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Make/Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Registration</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{vehicle.vin}</td>
                      <td className="px-4 py-3 text-sm">{vehicle.make} {vehicle.model}</td>
                      <td className="px-4 py-3 text-sm">{vehicle.year}</td>
                      <td className="px-4 py-3 text-sm">{vehicle.registration_number || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                        {vehicle.interpol_flag && (
                          <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-red-600 text-white">
                            INTERPOL
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewDetails(vehicle.id)}
                          className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vehicle Details Modal */}
        {selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Vehicle Details</h3>
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedVehicle.interpol_flag && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="font-bold text-red-900">INTERPOL FLAGGED</p>
                        <p className="text-sm text-red-800">{selectedVehicle.interpol_flag_reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-semibold">{selectedVehicle.vin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-semibold">{selectedVehicle.registration_number || 'Not registered'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-semibold">{selectedVehicle.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-semibold">{selectedVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold">{selectedVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold">{selectedVehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engine Number</p>
                    <p className="font-semibold">{selectedVehicle.engine_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chassis Number</p>
                    <p className="font-semibold">{selectedVehicle.chassis_number || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Import Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Import Date</p>
                      <p className="font-semibold">{new Date(selectedVehicle.import_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Port of Entry</p>
                      <p className="font-semibold">{selectedVehicle.port_of_entry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country of Origin</p>
                      <p className="font-semibold">{selectedVehicle.country_of_origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customs Entry Number</p>
                      <p className="font-semibold">{selectedVehicle.customs_entry_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Importer Name</p>
                      <p className="font-semibold">{selectedVehicle.importer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Owner</p>
                      <p className="font-semibold">{selectedVehicle.current_owner_name || 'Same as importer'}</p>
                    </div>
                  </div>
                </div>

                {(user.role === 'admin' || user.role === 'interpol') && (
                  <div className="border-t pt-4 flex space-x-4">
                    {!selectedVehicle.interpol_flag ? (
                      <button
                        onClick={() => setShowFlagModal(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Flag for Interpol
                      </button>
                    ) : (
                      <button
                        onClick={handleUnflagVehicle}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        Remove Interpol Flag
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Flag Modal */}
        {showFlagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Flag Vehicle for Interpol</h3>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Enter reason for flagging..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                rows={4}
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleFlagVehicle}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Flag Vehicle
                </button>
                <button
                  onClick={() => {
                    setShowFlagModal(false);
                    setFlagReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VehicleSearch;
