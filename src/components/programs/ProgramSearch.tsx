// src/components/programs/ProgramSearch.tsx
'use client';

import { useState } from 'react';

interface ProgramSearchProps {
  onSearch: (query: string, showInactive: boolean) => void;
}

export default function ProgramSearch({ onSearch }: ProgramSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, showInactive);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search programs by name"
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showInactive"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 rounded"
          />
          <label htmlFor="showInactive" className="ml-2 text-gray-300">
            Show inactive programs
          </label>
        </div>
        
        <button type="submit" className="btn btn-primary md:w-auto">
          Search
        </button>
      </div>
    </form>
  );
}