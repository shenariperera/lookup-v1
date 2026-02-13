'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OfferPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchOffer();
    }
  }, [params.id]);

  async function fetchOffer() {
    try {
      const res = await fetch(`/api/offers/${params.id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch offer');
      }

      // Only allow preview for PENDING offers
      if (data.status !== 'PENDING') {
        setError('Preview is only available for pending offers. This offer is already live.');
        setLoading(false);
        return;
      }

      setOffer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-error-50 border border-error-200 rounded-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-error-900">Preview Not Available</h3>
          </div>
          <p className="text-error-800 mb-6">{error}</p>
          <Link
            href="/dashboard/offers"
            className="inline-block px-6 py-3 bg-error-600 hover:bg-error-700 text-white font-semibold rounded-md transition-colors"
          >
            Back to My Offers
          </Link>
        </div>
      </div>
    );
  }

  if (!offer) return null;

  return (
    <div className="space-y-6">
      {/* Preview Mode Banner */}
      <div className="bg-warning-50 border-2 border-warning-300 rounded-md p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-warning-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div>
              <p className="font-bold text-warning-900">Preview Mode</p>
              <p className="text-sm text-warning-800">This is how your offer will look once approved</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/offers/${offer.id}/edit`}
              className="px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              Edit Offer
            </Link>
            <Link
              href="/dashboard/offers"
              className="px-4 py-2 bg-white border border-warning-300 text-warning-800 hover:bg-warning-50 text-sm font-semibold rounded-md transition-colors"
            >
              Back to Offers
            </Link>
          </div>
        </div>
      </div>

      {/* Offer Preview */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Image */}
          {offer.coverImage && (
            <div className="w-full h-96 bg-gray-200">
              <img
                src={offer.coverImage}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Category */}
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full mb-4">
              {offer.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{offer.title}</h1>

            {/* Pricing */}
            {offer.originalPrice && (
              <div className="mb-6 flex items-center gap-4">
                {offer.discountPercent && (
                  <>
                    <span className="text-3xl font-bold text-gray-400 line-through">
                      LKR {parseFloat(offer.originalPrice).toLocaleString()}
                    </span>
                    <span className="px-3 py-1 bg-secondary-500 text-white text-lg font-bold rounded-full">
                      {offer.discountPercent}% OFF
                    </span>
                  </>
                )}
                {offer.finalPrice && (
                  <span className="text-4xl font-bold text-primary-600">
                    LKR {parseFloat(offer.finalPrice).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="mb-6 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  <strong>Starts:</strong> {new Date(offer.startDate).toLocaleDateString()} at {new Date(offer.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>Ends:</strong> {new Date(offer.endDate).toLocaleDateString()} at {new Date(offer.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Offer Details</h2>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: offer.description }}
              />
            </div>

            {/* Terms */}
            {offer.terms && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Terms & Conditions</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{offer.terms}</p>
              </div>
            )}

            {/* CTA */}
            <div className="p-6 bg-primary-50 border-2 border-primary-200 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get This Offer</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {offer.ctaButtonLink && (
                  <a
                    href={offer.ctaButtonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold rounded-md transition-colors text-center"
                  >
                    {offer.ctaButtonText || 'Get Offer Now'}
                  </a>
                )}
                {offer.ctaEmail && (
                  <a
                    href={`mailto:${offer.ctaEmail}`}
                    className="flex-1 px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-bold rounded-md transition-colors text-center"
                  >
                    Email Us
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}