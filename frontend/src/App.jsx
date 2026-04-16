import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleSearch from './pages/VehicleSearch';
import CustomsAddVehicle from './pages/CustomsAddVehicle';
import PoliceInterpol from './pages/PoliceInterpol';
import AdminRegister from './pages/AdminRegister';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <VehicleSearch />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customs/add-vehicle"
            element={
              <ProtectedRoute allowedRoles={['customs', 'admin']}>
                <CustomsAddVehicle />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/police/interpol"
            element={
              <ProtectedRoute allowedRoles={['police', 'admin', 'interpol']}>
                <PoliceInterpol />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/register"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRegister />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
