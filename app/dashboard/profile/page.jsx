'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { optimizeAndUpload, validateImageFile, getImagePreviewUrl, revokeImagePreviewUrl } from '@/lib/imageUpload';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    website: '',
    phone: '',
    whatsapp: '',
    email: '',
    location: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    logoUrl: null,
    bannerUrl: null,
  });

  const [previews, setPreviews] = useState({
    logo: null,
    banner: null,
  });

  const categories = [
    'Automotive',
    'Education & Training',
    'Electronics & Technology',
    'Entertainment',
    'Fashion & Accessories',
    'Food & Dining',
    'Health & Beauty',
    'Home & Garden',
    'Professional Services',
    'Real Estate',
    'Shopping & Retail',
    'Sports & Fitness',
    'Travel & Hotels',
  ];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  async function fetchCompanyProfile() {
    try {
      const res = await fetch('/api/companies/profile');
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (success) setSuccess('');
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, [type]: validation.error }));
      return;
    }

    setUploading(type);
    setErrors(prev => ({ ...prev, [type]: null }));
    if (success) setSuccess('');

    try {
      const previewUrl = getImagePreviewUrl(file);
      setPreviews(prev => ({ ...prev, [type]: previewUrl }));

      const folder = type === 'logo' ? 'company-logos' : 'company-banners';
      const url = await optimizeAndUpload(file, type === 'logo' ? 'logo' : 'banner', folder);

      setFormData(prev => ({
        ...prev,
        [`${type}Url`]: url
      }));
    } catch (error) {
      console.error(`${type} upload failed:`, error);
      setErrors(prev => ({ ...prev, [type]: error.message }));
      if (previews[type]) {
        revokeImagePreviewUrl(previews[type]);
        setPreviews(prev => ({ ...prev, [type]: null }));
      }
    } finally {
      setUploading(null);
    }
  };

  const removeImage = (type) => {
    if (previews[type]) {
      revokeImagePreviewUrl(previews[type]);
    }
    setPreviews(prev => ({ ...prev, [type]: null }));
    setFormData(prev => ({ ...prev, [`${type}Url`]: null }));
    if (success) setSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.logoUrl) {
      newErrors.logo = 'Company logo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/companies/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Refresh router to update sidebar
      router.refresh();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Company Profile</h2>
        <p className="mt-2 text-gray-600">Manage your company information and branding</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-success-50 border border-success-200 rounded-md p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-success-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-success-800">{success}</p>
          </div>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-error-50 border border-error-200 rounded-md p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-error-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-error-800">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-error-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-error-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
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
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.phone ? 'border-error-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-error-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Colombo 03, Kandy, Galle"
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.location ? 'border-error-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="mt-2 text-sm text-error-600">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Social Media</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourpage"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                TikTok
              </label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                placeholder="https://tiktok.com/@yourpage"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourpage"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Branding</h3>

          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Company Logo *
            </label>
            
            {(previews.logo || formData.logoUrl) && (
              <div className="mb-4 relative inline-block">
                <img
                  src={previews.logo || formData.logoUrl}
                  alt="Company logo"
                  className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage('logo')}
                  className="absolute -top-2 -right-2 p-2 bg-error-500 text-white rounded-full hover:bg-error-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {!formData.logoUrl && (
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  disabled={uploading === 'logo'}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className={`flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                    uploading === 'logo'
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-primary-300 hover:border-primary-500 hover:bg-primary-50'
                  }`}
                >
                  {uploading === 'logo' ? (
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
                      <span className="font-medium text-gray-700">Upload Logo</span>
                    </>
                  )}
                </label>
              </div>
            )}

            {errors.logo && (
              <p className="mt-2 text-sm text-error-600">{errors.logo}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Square logo recommended. Max 10MB.
            </p>
          </div>

          {/* Banner */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Banner Image (Optional)
            </label>
            
            {(previews.banner || formData.bannerUrl) && (
              <div className="mb-4 relative">
                <img
                  src={previews.banner || formData.bannerUrl}
                  alt="Company banner"
                  className="w-full h-48 object-cover rounded-md border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage('banner')}
                  className="absolute top-2 right-2 p-2 bg-error-500 text-white rounded-full hover:bg-error-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {!formData.bannerUrl && (
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  disabled={uploading === 'banner'}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className={`flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                    uploading === 'banner'
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-primary-300 hover:border-primary-500 hover:bg-primary-50'
                  }`}
                >
                  {uploading === 'banner' ? (
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
                      <span className="font-medium text-gray-700">Upload Banner</span>
                    </>
                  )}
                </label>
              </div>
            )}

            {errors.banner && (
              <p className="mt-2 text-sm text-error-600">{errors.banner}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Wide banner for your profile page. Recommended size: 1920x480px. Max 10MB.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}