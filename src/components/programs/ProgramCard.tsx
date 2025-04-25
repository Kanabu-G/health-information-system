// src/components/programs/ProgramCard.tsx
'use client';

import Link from 'next/link';
import { Program } from '@prisma/client';

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`h-10 w-10 rounded-md flex items-center justify-center mr-3 ${
            program.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {program.active ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-amber-200 group-hover:text-amber-100">
              {program.name}
            </h3>
            <p className="text-sm text-gray-300">
              Created: {new Date(program.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          program.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {program.active ? 'Active' : 'Inactive'}
        </div>
      </div>
      
      <p className="text-gray-300 mb-6 line-clamp-2">
        {program.description || 'No description provided.'}
      </p>
      
      <div className="flex justify-end mt-auto">
        <Link href={`/programs/${program.id}`} className="btn btn-secondary">
          View Details
        </Link>
      </div>
    </div>
  );
}