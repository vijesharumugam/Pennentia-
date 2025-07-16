import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = [
    { name: 'Dashboard', path: '/admin', icon: ChartBarIcon },
    { name: 'Products', path: '/admin/products', icon: CubeIcon },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'Customers', path: '/admin/customers', icon: UserGroupIcon },
    { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const handleSignOut = () => {
    // TODO: Implement actual sign out logic
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isSidebarOpen ? 'Pennentia Admin' : 'PA'}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              {isSidebarOpen && <span className="ml-3">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 