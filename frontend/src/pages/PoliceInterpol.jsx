import React, { useState } from 'react';
import Layout from '../components/Layout';
import { vehicleAPI } from '../utils/api';

const PoliceInterpol = () => {
  const [searchVin, setSearchVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleQuickSearch = async (e) => {
    e.preventDefault();
    if (!searchVin.trim()) {
      alert('Please enter a VIN');
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    setVehicle(null);

    try {
      const response = await vehicleAPI.search({ vin: searchVin });
      if (response.data && response.data.length > 0) {
        // Get full details
        const detailsResponse = await vehicleAPI.getById(response.data[0].id);
        setVehicle(detailsResponse.data);
      } else {
        setVehicle(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      imported: { color: 'bg-blue-500', text: 'Imported' },
      active: { color: 'bg-green-500', text: 'Active' },
      transferred: { color: 'bg-purple-500', text: 'Transferred' },
      flagged: { color: 'bg-orange-500', text: 'Flagged' },
      stolen: { color: 'bg-red-600', text: 'STOLEN' },
    };
    return badges[status] || badges.active;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Interpol Vehicle Verification</h2>
          <p className="text-gray-600">Quick VIN check for stolen or flagged vehicles</p>
        </div>

        {/* Quick Search - Optimized for Tablets */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleQuickSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchVin}
                onChange={(e) => setSearchVin(e.target.value.toUpperCase())}
                placeholder="Enter VIN to check"
                className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg transition disabled:opacity-50 min-w-[150px]"
              >
                {loading ? '🔍 Checking...' : '🔍 Check VIN'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Display */}
        {searchPerformed && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {vehicle ? (
              <div>
                {/* Alert Banner */}
                {vehicle.interpol_flag && (
                  <div className="bg-red-600 text-white p-6 text-center">
                    <div className="text-6xl mb-2">⚠️</div>
                    <h3 className="text-3xl font-bold mb-2">INTERPOL ALERT</h3>
                    <p className="text-xl">This vehicle has been flagged</p>
                  </div>
                )}

                {!vehicle.interpol_flag && (
                  <div className="bg-green-600 text-white p-6 text-center">
                    <div className="text-6xl mb-2">✅</div>
                    <h3 className="text-3xl font-bold mb-2">VEHICLE FOUND</h3>
                    <p className="text-xl">No Interpol flags detected</p>
                  </div>
                )}

                {/* Vehicle Details - Large Text for Tablet Viewing */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">VIN</p>
                      <p className="text-2xl font-bold text-gray-900">{vehicle.vin}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Registration</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vehicle.registration_number || 'Not Registered'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Make & Model</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Year</p>
                      <p className="text-2xl font-bold text-gray-900">{vehicle.year}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Color</p>
                      <p className="text-2xl font-bold text-gray-900">{vehicle.color}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`${getStatusBadge(vehicle.status).color} text-white px-4 py-2 rounded-lg text-xl font-bold`}>
                          {getStatusBadge(vehicle.status).text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interpol Flag Details */}
                  {vehicle.interpol_flag && (
                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold text-red-900 mb-3">⚠️ Interpol Flag Details</h4>
                      <p className="text-lg text-red-800">{vehicle.interpol_flag_reason}</p>
                      <p className="text-sm text-red-700 mt-2">
                        Flagged on: {new Date(vehicle.interpol_flag_date).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Import History */}
                  <div className="border-t pt-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Import History</h4>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <div>
                        <p className="text-gray-500">Import Date:</p>
                        <p className="font-semibold">{new Date(vehicle.import_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Port of Entry:</p>
                        <p className="font-semibold">{vehicle.port_of_entry}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Country of Origin:</p>
                        <p className="font-semibold">{vehicle.country_of_origin}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Customs Entry:</p>
                        <p className="font-semibold">{vehicle.customs_entry_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Importer:</p>
                        <p className="font-semibold">{vehicle.importer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Owner:</p>
                        <p className="font-semibold">{vehicle.current_owner_name || 'Same as importer'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Vehicle Found</h3>
                <p className="text-lg text-gray-600">VIN not found in the system</p>
                <p className="text-sm text-gray-500 mt-4">This vehicle may not have been imported through official channels</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!searchPerformed && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 text-lg mb-3">Interpol Verification System</h3>
            <div className="text-blue-800 space-y-2">
              <p>• Enter the Vehicle Identification Number (VIN) to check against Interpol database</p>
              <p>• System checks for stolen vehicles and international flags</p>
              <p>• Results appear instantly - optimized for roadside checks</p>
              <p>• All searches are logged for security purposes</p>
              <p className="font-semibold mt-4">🚨 If vehicle is flagged, follow standard protocols and report immediately</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PoliceInterpol;
