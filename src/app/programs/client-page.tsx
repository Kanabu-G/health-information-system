// src/app/programs/client-page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Program } from '@prisma/client';
import ProgramCard from '@/components/programs/ProgramCard';
import ProgramSearch from '@/components/programs/ProgramSearch';

interface ProgramsClientPageProps {
  initialPrograms: Program[];
}

export default function ProgramsClientPage({ initialPrograms }: ProgramsClientPageProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, showInactive: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (showInactive) params.append('includeInactive', 'true');

      // Fetch filtered programs
      const response = await fetch(`/api/programs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search programs');
      }
      
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      setError('An error occurred while searching programs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ProgramSearch onSearch={handleSearch} />
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-10 w-10 text-amber-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300">Loading programs...</p>
        </div>
      ) : programs.length === 0 ? (
        <div className="card text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-semibold text-amber-200 mb-2">No Programs Found</h3>
          <p className="text-gray-300 mb-6">
            {initialPrograms.length === 0
              ? 'Start by creating your first health program.'
              : 'Try adjusting your search criteria.'}
          </p>
          <Link href="/programs/create" className="btn btn-primary inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Program
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}