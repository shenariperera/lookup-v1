'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DealsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [offers, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, offerId: null, offerTitle: '' });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [editBlockedModal, setEditBlockedModal] = useState(false);
  
  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setDeals(data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  }

  const getOfferStatus = (offer) => {
    const isExpired = new Date(offer.endDate) < new Date();
    if (isExpired) return 'expired';
    return offer.status.toLowerCase();
  };

  const filteredDeals = offers.filter(offer => {
    const status = getOfferStatus(offer);
    if (activeTab === 'all') return true;
    return status === activeTab;
  });

  const tabCounts = {
    all: offers.length,
    pending: offers.filter(o => getOfferStatus(o) === 'pending').length,
    active: offers.filter(o => getOfferStatus(o) === 'active').length,
    expired: offers.filter(o => getOfferStatus(o) === 'expired').length,
  };

  const getStatusBadge = (offer) => {
    const isExpired = new Date(offer.endDate) < new Date();
    
    if (isExpired) {
      return <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Expired</span>;
    }
    
    switch (offer.status) {
      case 'PENDING':
        return <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-warning-100 text-warning-800">Pending</span>;
      case 'ACTIVE':
        return <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-success-100 text-success-800">Live</span>;
      default:
        return <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{offer.status}</span>;
    }
  };

  const isExpiringSoon = (endDate) => {
    const daysUntilExpiry = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const handleEditClick = (offer) => {
    if (offer.status !== 'PENDING') {
      setEditBlockedModal(true);
      return;
    }
    router.push(`/dashboard/offers/${offer.id}/edit`);
  };

  const openDeleteModal = (offer) => {
    setDeleteModal({ isOpen: true, offerId: offer.id, offerTitle: offer.title });
    setDeleteConfirmText('');
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, offerId: null, offerTitle: '' });
    setDeleteConfirmText('');
  };

  const handleDelete = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/offers/${deleteModal.offerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete offer');
      }

      setDeals(offers.filter(o => o.id !== deleteModal.offerId));
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete offer:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setDeleting(false);
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
          <p className="mt-4 text-gray-600">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Offers</h2>
          <p className="mt-2 text-gray-600">Manage all your offers and promotions</p>
        </div>
        <Link
          href="/dashboard/offers/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Offer
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary-900">Editing Policy</p>
            <p className="text-sm text-primary-800 mt-1">
              You can edit offers while <strong>Pending Approval</strong>. Once live, contact support@lookup.lk to make changes.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs - NO DISABLED */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All Offers' },
            { key: 'pending', label: 'Pending' },
            { key: 'active', label: 'Active' },
            { key: 'expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Offers List */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === 'all' ? 'No offers yet' : `No ${activeTab} offers`}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' 
              ? 'Get started by creating your first offer.'
              : `You don't have any ${activeTab} offers.`
            }
          </p>
          {activeTab === 'all' && (
            <Link
              href="/dashboard/offers/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Offer
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDeals.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {offer.coverImage && (
                  <img
                    src={offer.coverImage}
                    alt={offer.title}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">{offer.title}</h3>
                    {getStatusBadge(offer)}
                  </div>

                  <p className="text-sm text-gray-500 mb-2">{offer.category}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Ends: {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  {isExpiringSoon(offer.endDate) && offer.status === 'ACTIVE' && (
                    <div className="mb-3 p-2 bg-warning-50 border border-warning-200 rounded-md flex items-center gap-2">
                      <svg className="w-4 h-4 text-warning-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs font-medium text-warning-800">Expiring soon!</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {offer.status === 'PENDING' ? (
                      <>
                        <Link
                          href={`/dashboard/offers/${offer.id}/edit`}
                          className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-md transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/offers/${offer.id}/preview`}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-md transition-colors"
                        >
                          Preview
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(offer)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded-md cursor-not-allowed"
                          title="Cannot edit live offers"
                        >
                          Edit
                        </button>
                        <Link
                          href={`/offers/${offer.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-md transition-colors"
                        >
                          View Live
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => openDeleteModal(offer)}
                      className="px-3 py-1.5 bg-white border border-error-300 text-error-600 hover:bg-error-50 text-xs font-semibold rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Blocked Modal */}
      {editBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Editing Not Allowed</h3>
                <p className="text-sm text-gray-600">This offer is live</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Live offers cannot be edited. If you need changes, please contact support.
            </p>
            
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-6">
              <p className="text-sm text-primary-900 font-medium mb-1">Need to make changes?</p>
              <p className="text-sm text-primary-800">
                Email: <a href="mailto:support@lookup.lk" className="underline font-semibold">support@lookup.lk</a>
              </p>
            </div>

            <button
              onClick={() => setEditBlockedModal(false)}
              className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Offer</h3>
                <p className="text-sm text-gray-600">This cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Delete <strong>"{deleteModal.offerTitle}"</strong>?
              </p>
              
              <div className="bg-error-50 border border-error-200 rounded-md p-3 mb-4">
                <p className="text-sm text-error-800">
                  Type <strong>DELETE</strong> to confirm
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmText.toLowerCase() !== 'delete' || deleting}
                className="flex-1 px-4 py-3 bg-error-500 hover:bg-error-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}