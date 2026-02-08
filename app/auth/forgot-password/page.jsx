'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Check your email</h2>
            <p className="text-gray-600 mb-6 text-center">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 text-center mb-6">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <Link href="/auth/login">
              <Button variant="primary" fullWidth>
                Back to Login
              </Button>
            </Link>
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
              Reset your password
            </h1>
            <p className="text-primary-200 text-lg leading-relaxed max-w-md">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg px-5 py-4">
            <p className="text-primary-100 text-sm">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-white font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        <Link href="/" className="lg:hidden text-2xl font-bold text-primary-500 mb-8">
          Lookup<span className="text-primary-300">.lk</span>
        </Link>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Forgot password</h2>
          <p className="text-gray-500 mb-8">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376a12 12 0 1 0 20.817-4.747M12 15.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow"
              />
            </div>

            <Button variant="primary" fullWidth disabled={isLoading} type="submit">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 1 0 0 8v4a8 8 0 0 1-8-8z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}