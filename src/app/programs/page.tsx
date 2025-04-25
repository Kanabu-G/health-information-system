// src/app/programs/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProgramsClientPage from './client-page';

export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: {
      active: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-200">Health Programs</h1>
        <Link href="/programs/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Program
        </Link>
      </div>

      <ProgramsClientPage initialPrograms={programs} />
    </div>
  );
}