'use client';

import { useState } from 'react';

export default function SearchInput({ 
  placeholder = "Search for deals, companies, categories...",
  onSearch,
  className = ""
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-l-sm transition-colors"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold rounded-r-sm transition-colors flex items-center justify-center gap-2 border border-accent-500 text-sm"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        Search
      </button>
    </form>
  );
}