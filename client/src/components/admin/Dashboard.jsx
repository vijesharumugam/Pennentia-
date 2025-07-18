import React, { useEffect, useState } from 'react';
import {
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products
        const productsRes = await fetch('/api/products');
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const products = await productsRes.json();
        setProductCount(products.length);
        // Fetch orders
        const ordersRes = await fetch('/api/orders');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const orders = await ordersRes.json();
        setOrderCount(orders.length);
        setRecentOrders(orders.slice(0, 5));
        setTotalRevenue(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0));
        // Fetch users
        const usersRes = await fetch('/api/users');
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const users = await usersRes.json();
        setCustomerCount(users.length);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: 'Total Products',
      value: loading ? 'Loading...' : productCount,
      icon: CubeIcon,
      change: '',
      changeType: 'positive',
    },
    {
      name: 'Total Revenue',
      value: loading ? 'Loading...' : `₹${totalRevenue.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      change: '',
      changeType: 'positive',
    },
    {
      name: 'Total Orders',
      value: loading ? 'Loading...' : orderCount,
      icon: ShoppingBagIcon,
      change: '',
      changeType: 'positive',
    },
    {
      name: 'Total Customers',
      value: loading ? 'Loading...' : customerCount,
      icon: UserGroupIcon,
      change: '',
      changeType: 'positive',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {stat.value}
              </h2>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-6 text-gray-500">No orders found.</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 