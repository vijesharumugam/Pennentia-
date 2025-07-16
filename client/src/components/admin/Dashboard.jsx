import React from 'react';
import {
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      name: 'Total Revenue',
      value: '₹2,45,678',
      icon: CurrencyRupeeIcon,
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      name: 'Total Orders',
      value: '156',
      icon: ShoppingBagIcon,
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      name: 'Total Customers',
      value: '2,456',
      icon: UserGroupIcon,
      change: '+15.3%',
      changeType: 'positive',
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      icon: ChartBarIcon,
      change: '-2.1%',
      changeType: 'negative',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD123',
      customer: 'John Doe',
      date: '2024-03-20',
      amount: '₹4,599',
      status: 'Delivered',
    },
    {
      id: 'ORD124',
      customer: 'Jane Smith',
      date: '2024-03-19',
      amount: '₹2,899',
      status: 'Processing',
    },
    {
      id: 'ORD125',
      customer: 'Mike Johnson',
      date: '2024-03-19',
      amount: '₹1,299',
      status: 'Pending',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

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
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
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