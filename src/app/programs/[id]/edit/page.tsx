// src/app/programs/[id]/edit/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditProgramForm from '@/components/programs/EditProgramForm';

interface EditProgramPageProps {
  params: {
    id: string;
  };
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = params;

  const program = await prisma.program.findUnique({
    where: { id },
  });

  if (!program) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/programs/${id}`} className="text-amber-400 hover:text-amber-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Program
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6">Edit Program</h1>
        
        <div className="card">
          <EditProgramForm program={program} />
        </div>
      </div>
    </div>
  );
}