'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { optimizeAndUpload, validateImageFile, getImagePreviewUrl, revokeImagePreviewUrl } from '@/lib/imageUpload';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditOfferPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    terms: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    coverImage: null,
    ctaButtonText: '',
    ctaButtonLink: '',
    ctaEmail: '',
    originalPrice: '',
    discountPercent: '',
    finalPrice: '',
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

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'list', 'bullet', 'check',
    'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'color', 'background',
    'script'
  ];

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

      if (data.status !== 'PENDING') {
        setErrors({ form: 'Only pending offers can be edited. This offer is already live.' });
        setLoading(false);
        return;
      }

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      setFormData({
        title: data.title,
        description: data.description,
        terms: data.terms || '',
        category: data.category,
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        coverImage: data.coverImage,
        ctaButtonText: data.ctaButtonText || '',
        ctaButtonLink: data.ctaButtonLink || '',
        ctaEmail: data.ctaEmail || '',
        originalPrice: data.originalPrice || '',
        discountPercent: data.discountPercent || '',
        finalPrice: data.finalPrice || '',
      });

      if (data.coverImage) {
        setCoverPreview(data.coverImage);
      }
    } catch (err) {
      setErrors({ form: err.message });
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

    if (name === 'originalPrice' || name === 'discountPercent') {
      calculateFinalPrice(
        name === 'originalPrice' ? value : formData.originalPrice,
        name === 'discountPercent' ? value : formData.discountPercent
      );
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: null }));
    }
  };

  const calculateFinalPrice = (originalPrice, discountPercent) => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    
    if (!isNaN(price) && !isNaN(discount) && price > 0 && discount > 0 && discount <= 100) {
      const final = price - (price * discount / 100);
      setFormData(prev => ({ ...prev, finalPrice: final.toFixed(2) }));
    } else if (!isNaN(price) && price > 0 && (!discount || discount === 0)) {
      setFormData(prev => ({ ...prev, finalPrice: price.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, finalPrice: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, coverImage: validation.error }));
      return;
    }

    setImageUploading(true);
    setErrors(prev => ({ ...prev, coverImage: null }));

    try {
      const previewUrl = getImagePreviewUrl(file);
      setCoverPreview(previewUrl);

      const url = await optimizeAndUpload(file, 'offer', 'offer-images');
      
      setFormData(prev => ({ ...prev, coverImage: url }));
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
    if (coverPreview && !coverPreview.startsWith('http')) {
      revokeImagePreviewUrl(coverPreview);
    }
    setCoverPreview(null);
    setFormData(prev => ({ ...prev, coverImage: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim();
    if (!descriptionText) {
      newErrors.description = 'Description is required';
    } else if (descriptionText.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';

    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date/time must be after start date/time';
      }
    }

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }

    if (!formData.ctaButtonLink && !formData.ctaEmail) {
      newErrors.cta = 'Please provide either a CTA link or an email for inquiries';
    }

    if (formData.ctaButtonLink && !formData.ctaButtonText) {
      newErrors.ctaButtonText = 'Button text is required when link is provided';
    }

    if (formData.ctaEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ctaEmail)) {
      newErrors.ctaEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        terms: formData.terms || null,
        category: formData.category,
        coverImage: formData.coverImage,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        ctaButtonText: formData.ctaButtonText || null,
        ctaButtonLink: formData.ctaButtonLink || null,
        ctaEmail: formData.ctaEmail || null,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : null,
        finalPrice: formData.finalPrice ? parseFloat(formData.finalPrice) : null,
      };

      const response = await fetch(`/api/offers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update offer');
      }
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to update offer:', error);
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
          <p className="mt-4 text-gray-600">Loading offer...</p>
        </div>
      </div>
    );
  }

  if (errors.form && !formData.title) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-error-50 border border-error-200 rounded-md p-6">
          <h3 className="text-lg font-bold text-error-900 mb-2">Cannot Edit This Offer</h3>
          <p className="text-error-800 mb-6">{errors.form}</p>
          <button
            onClick={() => router.push('/dashboard/offers')}
            className="px-6 py-3 bg-error-600 hover:bg-error-700 text-white font-semibold rounded-md transition-colors"
          >
            Back to My Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Offer</h2>
          <p className="mt-2 text-gray-600">Update your offer details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 rounded-md p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-error-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-error-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Offer Title */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Offer Title <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 50% Off All Electronics - Limited Time Only"
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.title ? 'border-error-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-error-600">{errors.title}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Create a compelling title that grabs attention (minimum 10 characters)
            </p>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description <span className="text-error-500">*</span>
            </label>
            <div className={`border rounded-md ${errors.description ? 'border-error-500' : 'border-gray-300'}`}>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Describe your offer in detail. What makes it special? What are the key benefits?"
                className="bg-white"
                style={{ minHeight: '250px' }}
              />
            </div>
            {errors.description && (
              <p className="mt-2 text-sm text-error-600">{errors.description}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Use the toolbar to format your offer description (minimum 50 characters)
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Terms & Conditions <span className="text-gray-500 text-xs">(Optional)</span>
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

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category <span className="text-error-500">*</span>
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

          {/* Start Date & Time */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Start Date & Time <span className="text-error-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.startDate ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-2 text-sm text-error-600">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.startTime ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && (
                  <p className="mt-2 text-sm text-error-600">{errors.startTime}</p>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              When does this offer become active?
            </p>
          </div>

          {/* End Date & Time */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              End Date & Time <span className="text-error-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.endDate ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-2 text-sm text-error-600">{errors.endDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.endTime ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.endTime && (
                  <p className="mt-2 text-sm text-error-600">{errors.endTime}</p>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              When does this offer expire?
            </p>
          </div>

          {/* Cover Image */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Cover Image <span className="text-error-500">*</span>
            </label>
            
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
                  className="absolute top-2 right-2 p-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

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

          {/* Call to Action */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Call to Action <span className="text-error-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide at least one way for customers to take action (link or email)
            </p>

            {errors.cta && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
                <p className="text-sm text-error-800">{errors.cta}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  name="ctaButtonText"
                  value={formData.ctaButtonText}
                  onChange={handleChange}
                  placeholder="e.g., Get Offer Now, Shop Now, Book Now"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.ctaButtonText ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.ctaButtonText && (
                  <p className="mt-2 text-sm text-error-600">{errors.ctaButtonText}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link (URL)
                </label>
                <input
                  type="url"
                  name="ctaButtonLink"
                  value={formData.ctaButtonLink}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com/offer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Where should the button take customers?
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email for Inquiries
                </label>
                <input
                  type="email"
                  name="ctaEmail"
                  value={formData.ctaEmail}
                  onChange={handleChange}
                  placeholder="contact@yourcompany.com"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.ctaEmail ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.ctaEmail && (
                  <p className="mt-2 text-sm text-error-600">{errors.ctaEmail}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Customers can email you directly about this offer
                </p>
              </div>
            </div>
          </div>

          {/* Pricing (Optional) */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Pricing <span className="text-gray-500 text-xs">(Optional)</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add pricing details to show customers the savings
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (LKR)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="10000"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.originalPrice ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.originalPrice && (
                  <p className="mt-2 text-sm text-error-600">{errors.originalPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  max="100"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.discountPercent ? 'border-error-500' : 'border-gray-300'
                  }`}
                />
                {errors.discountPercent && (
                  <p className="mt-2 text-sm text-error-600">{errors.discountPercent}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Price (LKR)
                </label>
                <input
                  type="number"
                  name="finalPrice"
                  value={formData.finalPrice}
                  readOnly
                  placeholder="5000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
                <p className="mt-2 text-xs text-gray-500">Auto-calculated</p>
              </div>
            </div>

            {formData.originalPrice && formData.discountPercent && (
              <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-md">
                <p className="text-sm font-medium text-success-800">
                  Customers save LKR {(parseFloat(formData.originalPrice) - parseFloat(formData.finalPrice)).toFixed(2)} ({formData.discountPercent}% off)
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 sticky bottom-0 bg-gray-50 py-4 -mx-4 px-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || imageUploading}
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Offer Updated!</h3>
            <p className="text-gray-600 mb-6">
              Your changes have been saved successfully.
            </p>
            <button
              onClick={() => router.push('/dashboard/offers')}
              className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors cursor-pointer"
            >
              Back to My Offers
            </button>
          </div>
        </div>
      )}

      {/* ReactQuill Custom Styles */}
      <style jsx global>{`
        .ql-container {
          min-height: 250px;
          font-family: 'Poppins', sans-serif;
        }
        .ql-editor {
          min-height: 250px;
          font-size: 14px;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}