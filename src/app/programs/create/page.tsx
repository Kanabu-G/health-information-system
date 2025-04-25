// src/app/programs/create/page.tsx
import Link from 'next/link';
import CreateProgramForm from '@/components/programs/CreateProgramForm';

export default function CreateProgramPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/programs" className="text-amber-400 hover:text-amber-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6">Create New Health Program</h1>
        
        <div className="card">
          <CreateProgramForm />
        </div>
      </div>
    </div>
  );
}