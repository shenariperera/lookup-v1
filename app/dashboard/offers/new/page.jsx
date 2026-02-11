'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { optimizeAndUpload, validateImageFile, getImagePreviewUrl, revokeImagePreviewUrl } from '@/lib/imageUpload';

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    terms: '',
    category: '',
    location: '',
    endDate: '',
    coverImage: null,
  });

  const [coverPreview, setCoverPreview] = useState(null);

  const categories = [
    'Food & Dining',
    'Shopping & Retail',
    'Electronics & Technology',
    'Health & Beauty',
    'Travel & Hotels',
    'Education & Training',
    'Home & Garden',
    'Automotive',
    'Entertainment',
    'Professional Services',
    'Sports & Fitness',
    'Fashion & Accessories',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, coverImage: validation.error }));
      return;
    }

    setImageUploading(true);
    setErrors(prev => ({ ...prev, coverImage: null }));

    try {
      // Create preview
      const previewUrl = getImagePreviewUrl(file);
      setCoverPreview(previewUrl);

      // Upload to R2
      const url = await optimizeAndUpload(file, 'offer', 'offer-images');
      
      setFormData(prev => ({
        ...prev,
        coverImage: url
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      setErrors(prev => ({ ...prev, coverImage: error.message }));
      if (coverPreview) {
        revokeImagePreviewUrl(coverPreview);
        setCoverPreview(null);
      }
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    if (coverPreview) {
      revokeImagePreviewUrl(coverPreview);
    }
    
    setCoverPreview(null);
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        newErrors.endDate = 'End date must be in the future';
      }
    }

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create offer');
      }
      
      // Redirect to offers list
      router.push('/dashboard/offers');
      router.refresh();
    } catch (error) {
      console.error('Failed to create offer:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Create New Offer</h2>
        <p className="mt-2 text-gray-600">Fill in the details below to create a new offer</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Offer Title */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Offer Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., 50% Off All Electronics"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.title ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-error-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe your offer in detail. What makes it special? What are the key benefits?"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
              errors.description ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {formData.description.length} / 500 characters (minimum 50)
            </p>
            {errors.description && (
              <p className="text-sm text-error-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Terms & Conditions (Optional)
          </label>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            rows={4}
            placeholder="e.g., Valid until end of month. Cannot be combined with other offers. Limited to one per customer."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <p className="mt-2 text-sm text-gray-500">
            Add any restrictions or conditions that apply to this offer
          </p>
        </div>

        {/* Category & Location */}
        <div className="bg-white border border-gray-200 rounded-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.category ? 'border-error-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-error-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Colombo, Kandy, Islandwide"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Where is this offer available?
            </p>
          </div>
        </div>

        {/* End Date */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.endDate ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && (
            <p className="mt-2 text-sm text-error-600">{errors.endDate}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            When does this offer expire?
          </p>
        </div>

        {/* Cover Image */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Cover Image *
          </label>
          
          {/* Image preview */}
          {coverPreview && (
            <div className="mb-4 relative">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-64 object-cover rounded-md border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-error-500 text-white rounded-full hover:bg-error-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Upload button */}
          {!formData.coverImage && (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                  imageUploading
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-primary-300 hover:border-primary-500 hover:bg-primary-50'
                }`}
              >
                {imageUploading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="font-medium text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-700">
                      Click to upload cover image
                    </span>
                  </>
                )}
              </label>
            </div>
          )}

          {errors.coverImage && (
            <p className="mt-2 text-sm text-error-600">{errors.coverImage}</p>
          )}
          
          <p className="mt-2 text-sm text-gray-500">
            Upload a high-quality image for your offer card. JPG, PNG or WebP. Max 10MB.
          </p>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-md p-4">
            <p className="text-sm text-error-800">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Offer'}
          </button>
        </div>
      </form>
    </div>
  );
}