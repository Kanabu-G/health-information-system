// src/app/clients/[id]/not-found.tsx
import Link from 'next/link';

export default function ClientNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-amber-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <h1 className="text-4xl font-bold text-amber-200 mb-4">Client Not Found</h1>
      <p className="text-gray-300 max-w-md mb-8">
        The client you're looking for doesn't exist or may have been removed from the system.
      </p>
      
      <div className="flex space-x-4">
        <Link href="/clients" className="btn btn-primary">
          View All Clients
        </Link>
        <Link href="/clients/register" className="btn btn-secondary">
          Register New Client
        </Link>
      </div>
    </div>
  );
}