// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-amber-200 mb-6">
          Health Information System
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-10">
          A modern platform for managing clients and health programs with secure, efficient data management.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Link 
            href="/clients" 
            className="card p-8 flex flex-col items-center hover:scale-105 transition-transform"
          >
            <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-amber-200 mb-4">Client Management</h2>
            <p className="text-gray-300 mb-6">Register, search, and manage client profiles with ease.</p>
            <button className="btn btn-primary px-6 py-2 rounded-md mt-auto">
              Access Clients
            </button>
          </Link>
          
          <Link 
            href="/programs" 
            className="card p-8 flex flex-col items-center hover:scale-105 transition-transform"
          >
            <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-amber-200 mb-4">Health Programs</h2>
            <p className="text-gray-300 mb-6">Create and manage health programs for various conditions.</p>
            <button className="btn btn-primary px-6 py-2 rounded-md mt-auto">
              Access Programs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}