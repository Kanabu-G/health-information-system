// src/app/clients/register/page.tsx
import Link from 'next/link';
import CreateClientForm from '@/components/clients/CreateClientForm';

export default function RegisterClientPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/clients" className="text-amber-400 hover:text-amber-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Clients
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6">Register New Client</h1>
        
        <div className="card">
          <CreateClientForm />
        </div>
      </div>
    </div>
  );
}