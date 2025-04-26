// src/app/clients/client-page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Client } from '@prisma/client';
import ClientCard from '@/components/clients/ClientCard';
import ClientSearch from '@/components/clients/ClientSearch';

interface ClientsClientPageProps {
  initialClients: Client[];
  totalClients: number;
}

export default function ClientsClientPage({ initialClients, totalClients }: ClientsClientPageProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialClients.length < totalClients);
  const pageSize = 10;

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      params.append('page', '1'); // Reset to first page on new search
      params.append('pageSize', pageSize.toString());

      // Fetch filtered clients
      const response = await fetch(`/api/clients?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search clients');
      }
      
      const data = await response.json();
      setClients(data.clients);
      setPage(1);
      setHasMore(data.pagination.total > data.clients.length);
    } catch (err) {
      setError('An error occurred while searching clients');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      params.append('page', nextPage.toString());
      params.append('pageSize', pageSize.toString());
      
      const response = await fetch(`/api/clients?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to load more clients');
      }
      
      const data = await response.json();
      setClients(prev => [...prev, ...data.clients]);
      setPage(nextPage);
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load more clients');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ClientSearch onSearch={handleSearch} />
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isLoading && clients.length === 0 ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-10 w-10 text-amber-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="card text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-amber-200 mb-2">No Clients Found</h3>
          <p className="text-gray-300 mb-6">
            {initialClients.length === 0
              ? 'Start by registering your first client.'
              : 'Try adjusting your search criteria.'}
          </p>
          <Link href="/clients/register" className="btn btn-primary inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register New Client
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
          
          {hasMore && (
            <div className="text-center mt-8">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="btn btn-secondary"
              >
                {isLoading ? 'Loading...' : 'Load More Clients'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}