'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DealsPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('all');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      setDeals(data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDeals = deals.filter(deal => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return deal.status === 'ACTIVE' && new Date(deal.endDate) > new Date();
    if (filterStatus === 'expired') return new Date(deal.endDate) <= new Date();
    if (filterStatus === 'disabled') return deal.status === 'DISABLED';
    return true;
  });

  const getStatusColor = (deal) => {
    if (deal.status === 'DISABLED') {
      return 'bg-error-100 text-error-800';
    }
    if (new Date(deal.endDate) <= new Date()) {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-success-100 text-success-800';
  };

  const getStatusText = (deal) => {
    if (deal.status === 'DISABLED') return 'Disabled';
    if (new Date(deal.endDate) <= new Date()) return 'Expired';
    return 'Active';
  };

  const isExpiringSoon = (endDate) => {
    const daysUntilExpiry = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const handleDelete = async (dealId) => {
    if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete deal');
      }

      // Refresh deals list
      fetchDeals();
    } catch (error) {
      console.error('Failed to delete deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Deals</h2>
          <p className="mt-2 text-gray-600">Manage all your offers and promotions</p>
        </div>
        <Link
          href="/dashboard/deals/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Deal
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-md p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Deals ({deals.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-success-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({deals.filter(d => d.status === 'ACTIVE' && new Date(d.endDate) > new Date()).length})
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filterStatus === 'expired'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expired ({deals.filter(d => new Date(d.endDate) <= new Date()).length})
          </button>
          <button
            onClick={() => setFilterStatus('disabled')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filterStatus === 'disabled'
                ? 'bg-error-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disabled ({deals.filter(d => d.status === 'DISABLED').length})
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first deal.</p>
          <Link
            href="/dashboard/deals/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Deal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-200 rounded-md overflow-hidden">
              {/* Deal Image */}
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-48 flex items-center justify-center">
                {deal.coverImage ? (
                  <img src={deal.coverImage} alt={deal.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Deal Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{deal.title}</h3>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(deal)}`}>
                    {getStatusText(deal)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{deal.category}</p>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Ends {new Date(deal.endDate).toLocaleDateString()}</span>
                </div>

                {/* Expiring Soon Warning */}
                {isExpiringSoon(deal.endDate) && deal.status === 'ACTIVE' && (
                  <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-md flex items-center gap-2">
                    <svg className="w-5 h-5 text-warning-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm font-medium text-warning-800">Expiring soon!</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/deals/${deal.id}/edit`}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/deals/${deal.slug}`}
                    className="flex-1 px-4 py-2 bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-medium rounded-md transition-colors text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    className="px-4 py-2 bg-white border-2 border-error-500 text-error-500 hover:bg-error-50 font-medium rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}