'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import HeaderSearch from '@/components/layout/HeaderSearch';

export default function Header() {
  return (
    <header className="bg-primary-500 border-b border-primary-600 sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between h-16 gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="text-2xl font-bold text-white whitespace-nowrap">
              Lookup<span className="text-primary-100">.lk</span>
            </div>
          </Link>

          {/* Search Bar - centered and flexible */}
          <div className="flex-1 max-w-2xl mx-4">
            <HeaderSearch />
          </div>

          {/* Register Button */}
          <div className="flex items-center flex-shrink-0">
            <Button variant="accent" href="/auth/register">
              Register
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden">
          {/* Top Row - Logo and Register Button */}
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-bold text-white whitespace-nowrap">
                Lookup<span className="text-primary-100">.lk</span>
              </div>
            </Link>
            <Button variant="accent" href="/auth/register" size="small" className="px-6 whitespace-nowrap">
              Register
            </Button>
          </div>

          {/* Bottom Row - Search only */}
          <div className="pb-3">
            <HeaderSearch />
          </div>
        </div>
      </div>
    </header>
  );
}