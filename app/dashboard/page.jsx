'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentDeals, setRecentDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch dashboard stats
        const statsRes = await fetch('/api/dashboard/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch recent deals
        const dealsRes = await fetch('/api/dashboard/recent-deals');
        const dealsData = await dealsRes.json();
        setRecentDeals(dealsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statsDisplay = stats || {
    totalDeals: 0,
    activeDeals: 0,
    expiredDeals: 0,
  };

  const quickActions = [
    {
      name: 'Create New Deal',
      description: 'Add a new offer to your listing',
      href: '/dashboard/deals/new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-primary-500',
    },
    {
      name: 'Edit Profile',
      description: 'Update company information',
      href: '/dashboard/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-secondary-500',
    },
    {
      name: 'View All Deals',
      description: 'Manage your offers',
      href: '/dashboard/deals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      color: 'bg-success-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
        <p className="mt-2 text-gray-600">Here's what's happening with your deals today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deals</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{statsDisplay.totalDeals}</p>
            </div>
            <div className="bg-primary-500 text-white p-3 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{statsDisplay.activeDeals}</p>
            </div>
            <div className="bg-success-500 text-white p-3 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{statsDisplay.expiredDeals}</p>
            </div>
            <div className="bg-warning-500 text-white p-3 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="bg-white border border-gray-200 rounded-md p-6 hover:border-primary-200 transition-colors group"
            >
              <div className={`${action.color} text-white p-3 rounded-md inline-block mb-4`}>
                {action.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {action.name}
              </h4>
              <p className="mt-2 text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Deals */}
      {recentDeals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Deals</h3>
            <Link
              href="/dashboard/deals"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all →
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          deal.status === 'ACTIVE'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {deal.status === 'ACTIVE' ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(deal.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Account Status Banner */}
      <div className="bg-warning-50 border border-warning-200 rounded-md p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-warning-900">Account Pending Approval</h4>
            <p className="mt-1 text-sm text-warning-700">
              Your company profile is currently under review by our admin team. You can create and manage deals,
              but they won't be visible to the public until your account is approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}