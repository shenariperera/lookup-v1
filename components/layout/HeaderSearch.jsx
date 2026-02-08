'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeaderSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('offers');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const path = searchType === 'offers' ? '/deals' : '/companies';
      router.push(`${path}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const searchTypes = [
    { value: 'offers', label: 'Offers' },
    { value: 'companies', label: 'Companies' }
  ];

  // Get current label for display
  const currentLabel = searchTypes.find(t => t.value === searchType)?.label;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center flex-1 max-w-3xl h-10 bg-white border border-gray-300 rounded-md shadow-sm relative"
    >
      {/* Dropdown Container */}
      <div className="relative h-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="h-full px-3 sm:px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-md border-r border-gray-300 transition-colors flex items-center gap-1 sm:gap-2 min-w-[75px] sm:min-w-[110px] rounded-l-md"
        >
          {/* Updated this span to show the active selection on mobile too */}
          <span className="inline-block">
            {currentLabel}
          </span>
          
          <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-44 bg-white border border-gray-200 rounded-md shadow-xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {searchTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setSearchType(type.value);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-md transition-colors ${
                  searchType === type.value 
                    ? 'bg-primary-50 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`Search for ${searchType}...`}
        className="flex-1 h-full px-4 text-sm text-gray-900 placeholder-gray-500 bg-white focus:outline-none min-w-0"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="h-full px-4 sm:px-5 bg-accent-500 hover:bg-accent-600 text-gray-900 transition-colors flex items-center justify-center border-l border-gray-300 rounded-r-md flex-shrink-0"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </button>
    </form>
  );
}