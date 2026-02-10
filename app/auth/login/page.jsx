'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Check for email confirmation and password reset
  const confirmed = searchParams.get('confirmed') === 'true';
  const confirmError = searchParams.get('error') === 'confirmation-failed';
  const passwordReset = searchParams.get('reset') === 'success';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in.');
        } else {
          setError(signInError.message);
        }
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left Panel — brand block (hidden on mobile, shown lg+) */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary-500 relative overflow-hidden">
        {/* Subtle pattern circles for depth */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary-400 opacity-30" />
        <div className="absolute bottom-32 -right-16 w-56 h-56 rounded-full bg-primary-600 opacity-40" />
        <div className="absolute top-1/2 left-1/3 w-36 h-36 rounded-full bg-primary-300 opacity-20" />

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-white">
            Lookup<span className="text-primary-200">.lk</span>
          </Link>

          {/* Center copy */}
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome back
            </h1>
            <p className="text-primary-200 text-lg leading-relaxed max-w-md">
              Sign in to access your dashboard, manage your business listings, and keep your deals up to date.
            </p>
          </div>

          {/* Bottom stat pills */}
          <div className="flex gap-6">
            
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">

        {/* Mobile logo (visible < lg) */}
        <Link href="/" className="lg:hidden text-2xl font-bold text-primary-500 mb-8">
          Lookup<span className="text-primary-300">.lk</span>
        </Link>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-500 mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
              Register free
            </Link>
          </p>

          {/* Email confirmed success message */}
          {confirmed && (
            <div className="bg-success-50 border border-success-200 text-success-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Email confirmed! You can now sign in to your account.</span>
            </div>
          )}

          {/* Confirmation error message */}
          {confirmError && (
            <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376a12 12 0 1 0 20.817-4.747M12 15.75h.008v.008H12v-.008z" />
              </svg>
              <span>Email confirmation failed. Please try clicking the link again or contact support.</span>
            </div>
          )}

          {/* Password reset success message */}
          {passwordReset && (
            <div className="bg-success-50 border border-success-200 text-success-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Password reset successful! You can now sign in with your new password.</span>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376a12 12 0 1 0 20.817-4.747M12 15.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pr-11 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow"
                />
                {/* Toggle visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 cursor-pointer accent-primary-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <Button
              variant="primary"
              fullWidth
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 1 0 0 8v4a8 8 0 0 1-8-8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="hover:text-primary-500 underline transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="hover:text-primary-500 underline transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}