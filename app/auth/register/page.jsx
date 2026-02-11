'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { optimizeLogo, validateImageFile, getImagePreviewUrl, revokeImagePreviewUrl, uploadToR2 } from '@/lib/imageUpload';
import { CATEGORIES } from '@/lib/constants/categories';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    description: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    website: '',
    location: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [optimizingImage, setOptimizingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const emailConfirmed = searchParams.get('confirmed') === 'true';

  // Validation helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9+\s()-]{7,}$/.test(phone);
  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'companyName':
        return value.trim().length < 2 ? 'Company name must be at least 2 characters.' : '';
      case 'category':
        return !value ? 'Please select a category.' : '';
      case 'description':
        return value.trim().length < 20 ? 'Description must be at least 20 characters.' : '';
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email address.' : '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter.';
        if (!/[0-9]/.test(value)) return 'Include at least one number.';
        return '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match.' : '';
      case 'phone':
        return value && !validatePhone(value) ? 'Please enter a valid phone number.' : '';
      case 'whatsapp':
        return value && !validatePhone(value) ? 'Please enter a valid WhatsApp number.' : '';
      case 'website':
      case 'facebook':
      case 'instagram':
      case 'tiktok':
      case 'linkedin':
        return value && !validateUrl(value) ? 'Please enter a valid URL.' : '';
      case 'location':
        return value.trim().length < 3 ? 'Location must be at least 3 characters.' : '';
      default:
        return '';
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 10);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, logo: validation.error }));
      return;
    }

    setOptimizingImage(true);
    setErrors((prev) => {
      const { logo, ...rest } = prev;
      return rest;
    });

    try {
      const optimizedFile = await optimizeLogo(file);
      setLogoFile(optimizedFile);
      const previewUrl = getImagePreviewUrl(optimizedFile);
      if (logoPreview) revokeImagePreviewUrl(logoPreview);
      setLogoPreview(previewUrl);
    } catch (error) {
      console.error('Image optimization failed:', error);
      setErrors((prev) => ({ ...prev, logo: error.message || 'Failed to process image.' }));
    } finally {
      setOptimizingImage(false);
    }
  };

  const removeLogo = () => {
    if (logoPreview) revokeImagePreviewUrl(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    const fileInput = document.getElementById('logo-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
    if (name === 'password' && errors.confirmPassword) {
      const err = formData.confirmPassword !== value ? 'Passwords do not match.' : '';
      setErrors((prev) => ({ ...prev, confirmPassword: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    if (err) setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleStep1Next = () => {
    const newErrors = {};
    ['companyName', 'category', 'description'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    if (!logoFile) newErrors.logo = 'Company logo is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleStep2Next = () => {
    const newErrors = {};
    ['email', 'password', 'confirmPassword'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  const handleStep3Next = () => {
    const newErrors = {};
    ['phone', 'location'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    if (formData.whatsapp) {
      const err = validateField('whatsapp', formData.whatsapp);
      if (err) newErrors.whatsapp = err;
    }
    if (formData.website) {
      const err = validateField('website', formData.website);
      if (err) newErrors.website = err;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(4);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      setUploadingLogo(true);
      const logoUrl = await uploadToR2(logoFile, 'company-logos');
      setUploadingLogo(false);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.companyName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          category: formData.category,
          phone: formData.phone,
          whatsapp: formData.whatsapp || null,
          website: formData.website || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          tiktok: formData.tiktok || null,
          linkedin: formData.linkedin || null,
          location: formData.location,
          description: formData.description,
          logoUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.message || 'Registration failed.' });
        return;
      }

      setRegistrationComplete(true);
    } catch (err) {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full h-11 px-4 bg-white border rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow ${
      errors[field] ? 'border-error-400' : 'border-gray-300'
    }`;

  if (registrationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-md shadow-lg p-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a confirmation email to <strong>{formData.email}</strong>. Please check your inbox and click the confirmation link to activate your account.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-6">
              <p className="text-sm text-primary-800">
                <strong>Important:</strong> Check your spam folder if you don't see the email within a few minutes.
              </p>
            </div>
            <Button variant="primary" fullWidth onClick={() => router.push('/auth/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (emailConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-md shadow-lg p-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed!</h2>
            <p className="text-gray-600 mb-6">Thank you for confirming your email address. Your account is now active and ready to use.</p>
            <Button variant="primary" fullWidth onClick={() => router.push('/auth/login')}>
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary-500 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary-400 opacity-30" />
        <div className="absolute bottom-32 -right-16 w-56 h-56 rounded-full bg-primary-600 opacity-40" />
        <div className="absolute top-1/2 left-1/3 w-36 h-36 rounded-full bg-primary-300 opacity-20" />

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12">
          <Link href="/" className="text-3xl font-bold text-white">
            Lookup<span className="text-primary-200">.lk</span>
          </Link>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Grow your<br />business for free
            </h1>
            <p className="text-primary-200 text-lg leading-relaxed max-w-md">
              List your business, post unlimited offers, and reach thousands of customers across Sri Lanka – completely free.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                'Free business listing',
                'Post unlimited offers & offers',
                'Reach local customers easily',
                'Simple dashboard to manage everything',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-primary-100 text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white bg-opacity-10 rounded-md px-5 py-4">
            <p className="text-primary-700 text-sm italic leading-relaxed">
              "Listing on Lookup.lk brought us new customers within the first week. The offers feature is a game-changer."
            </p>
            <p className="text-white text-sm font-semibold mt-2">– Sarah J., Colombo Cafe</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-start lg:pt-8 px-6 py-4 bg-gray-50">
        <Link href="/" className="lg:hidden text-2xl font-bold text-primary-500 mb-8">
          Lookup<span className="text-primary-300">.lk</span>
        </Link>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 mb-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 4 ? 'bg-primary-500' : 'bg-gray-200'}`} />
          </div>

          {errors.form && (
            <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-md px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376a12 12 0 1 0 20.817-4.747M12 15.75h.008v.008H12v-.008z" />
              </svg>
              <span>{errors.form}</span>
            </div>
          )}

          {/* STEP 1: Company Info & Logo - Compact */}
          {step === 1 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Company Info</h3>

              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-1">
                  Company name <span className="text-error-500">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="The Coffee House"
                  className={inputClass('companyName')}
                />
                {errors.companyName && <p className="mt-1 text-xs text-error-500">{errors.companyName}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                  Business category <span className="text-error-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('category')}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-error-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Logo <span className="text-error-500">*</span>
                </label>

                {!logoPreview ? (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleLogoChange}
                      disabled={optimizingImage}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                        errors.logo ? 'border-error-400 bg-error-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      } ${optimizingImage ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center py-3">
                        {optimizingImage ? (
                          <>
                            <svg className="animate-spin w-6 h-6 mb-1 text-primary-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 1 0 0 8v4a8 8 0 0 1-8-8z" />
                            </svg>
                            <p className="text-xs text-gray-600">Optimizing...</p>
                          </>
                        ) : (
                          <>
                            <svg className="w-8 h-8 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-xs text-gray-600 text-center font-semibold">Click to upload</p>
                            <p className="text-xs text-gray-400">JPG, PNG or WebP</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-28 h-28 mx-auto rounded-md overflow-hidden border-2 border-gray-200">
                    <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-1 right-1 bg-error-500 hover:bg-error-600 text-white rounded-full p-1 transition-colors shadow-lg"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {errors.logo && <p className="mt-1 text-xs text-error-500">{errors.logo}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                  Business description <span className="text-error-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell customers about your business... (min 20 characters)"
                  rows={2}
                  className={`w-full px-4 py-2 bg-white border rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow resize-none ${
                    errors.description ? 'border-error-400' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="mt-1 text-xs text-error-500">{errors.description}</p>}
                <p className="mt-1 text-xs text-gray-400">{formData.description.length} / 20 min</p>
              </div>

              <div className="pt-1">
                <Button variant="primary" fullWidth onClick={handleStep1Next}>
                  Next: Account Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Account Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Account Details</h3>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address <span className="text-error-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="adam@example.com"
                  autoComplete="email"
                  className={inputClass('email')}
                />
                {errors.email && <p className="mt-1.5 text-xs text-error-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    className={`${inputClass('password')} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-error-500">{errors.password}</p>}
                <p className="mt-1.5 text-xs text-gray-400">Must include an uppercase letter and a number.</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm password <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={`${inputClass('confirmPassword')} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-error-500">{errors.confirmPassword}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={handlePrevStep}>
                  Back
                </Button>
                <Button variant="primary" fullWidth onClick={handleStep2Next}>
                  Next: Contact Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Contact Details</h3>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone number <span className="text-error-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+94 11 234 5678"
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-error-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  WhatsApp number <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+94 77 123 4567"
                  className={inputClass('whatsapp')}
                />
                {errors.whatsapp && <p className="mt-1.5 text-xs text-error-500">{errors.whatsapp}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Business address <span className="text-error-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123 Main Street, Colombo 07"
                  className={inputClass('location')}
                />
                {errors.location && <p className="mt-1.5 text-xs text-error-500">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Website <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://coffeehouse.lk"
                  className={inputClass('website')}
                />
                {errors.website && <p className="mt-1.5 text-xs text-error-500">{errors.website}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={handlePrevStep}>
                  Back
                </Button>
                <Button variant="primary" fullWidth onClick={handleStep3Next}>
                  Next: Social Media
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Social Media */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 4: Social Media <span className="text-gray-400 text-sm font-normal">(optional)</span></h3>

              <div>
                <label htmlFor="facebook" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Facebook
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://facebook.com/yourpage"
                  className={inputClass('facebook')}
                />
                {errors.facebook && <p className="mt-1.5 text-xs text-error-500">{errors.facebook}</p>}
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Instagram
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://instagram.com/yourprofile"
                  className={inputClass('instagram')}
                />
                {errors.instagram && <p className="mt-1.5 text-xs text-error-500">{errors.instagram}</p>}
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  TikTok
                </label>
                <input
                  id="tiktok"
                  name="tiktok"
                  type="url"
                  value={formData.tiktok}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://tiktok.com/@yourprofile"
                  className={inputClass('tiktok')}
                />
                {errors.tiktok && <p className="mt-1.5 text-xs text-error-500">{errors.tiktok}</p>}
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className={inputClass('linkedin')}
                />
                {errors.linkedin && <p className="mt-1.5 text-xs text-error-500">{errors.linkedin}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={handlePrevStep} disabled={isLoading}>
                  Back
                </Button>
                <Button variant="primary" fullWidth type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 1 0 0 8v4a8 8 0 0 1-8-8z" />
                      </svg>
                      {uploadingLogo ? 'Uploading logo...' : 'Creating account...'}
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-gray-400">
            By registering, you agree to our{' '}
            <Link href="/terms" className="hover:text-primary-500 underline transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="hover:text-primary-500 underline transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}