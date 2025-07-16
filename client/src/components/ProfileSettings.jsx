import React, { useState } from 'react';
import { XMarkIcon, CameraIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileSettings = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Main St, City, State, 123456',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      orderUpdates: true,
      promotions: false,
      newsletter: true,
    },
    paymentMethods: [],
  });

  // Mock admin check - replace with actual auth logic
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log('Profile data:', formData);
  };

  const addPaymentMethod = () => {
    // TODO: Implement payment method addition
    console.log('Adding payment method');
  };

  const handleAdminPanelClick = () => {
    onClose();
    navigate('/admin');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <CameraIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
              <CameraIcon className="h-4 w-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Admin Panel Link */}
        {isAdmin && (
          <div className="mb-6">
            <button
              onClick={handleAdminPanelClick}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Access Admin Panel
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="orderUpdates"
                  checked={formData.notifications.orderUpdates}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">Order Updates</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="promotions"
                  checked={formData.notifications.promotions}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">Promotions</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.notifications.newsletter}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">Newsletter</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ProfileSettings; 