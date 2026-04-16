import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-600',
      customs: 'bg-blue-600',
      police: 'bg-green-600',
      interpol: 'bg-red-600',
      public: 'bg-gray-600',
    };
    return colors[role] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">ZVMS</h1>
              <span className="text-sm text-primary-200">Zimbabwe Vehicle Management</span>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{user.full_name}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(user.role)} text-white`}>
                      {user.role.toUpperCase()}
                    </span>
                    {user.organization && (
                      <span className="text-xs text-primary-200">{user.organization}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-primary-700 hover:bg-primary-600 rounded-lg text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Zimbabwe Vehicle Management System © 2025 | ZIMRA</p>
          <p className="text-xs mt-1">Optimized for tablets and mobile devices</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
