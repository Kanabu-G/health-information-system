// src/app/programs/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DeleteProgramButton from '@/components/programs/DeleteProgramButton';

export const dynamic = 'force-dynamic';

interface ProgramPageProps {
  params: {
    id: string;
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = params;

  // Fetch program details with enrollment count
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!program) {
    notFound();
  }

  // Fetch recent enrollments for this program
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { programId: id },
    include: {
      client: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

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

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-amber-200 mr-3">{program.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                program.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {program.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-300">
              Created: {new Date(program.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link 
              href={`/programs/${program.id}/edit`}
              className="btn btn-secondary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <DeleteProgramButton programId={program.id} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-amber-200 mb-2">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {program.description || 'No description provided.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gray-800/30 flex flex-col items-center justify-center py-6">
            <div className="text-4xl font-bold text-amber-200 mb-2">{program._count.enrollments}</div>
            <p className="text-gray-300">Total Enrollments</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-amber-200">Recent Enrollments</h2>
        <Link href={`/programs/${program.id}/enrollments`} className="btn btn-secondary">
          View All
        </Link>
      </div>

      {recentEnrollments.length === 0 ? (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h3 className="text-xl font-semibold text-amber-200 mb-2">No Enrollments Yet</h3>
          <p className="text-gray-300 mb-6">
            There are no clients enrolled in this program yet.
          </p>
          <Link href="/clients" className="btn btn-primary">
            View Clients
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Enrollment Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white">
                        {enrollment.client.firstName} {enrollment.client.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      enrollment.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : enrollment.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(enrollment.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/clients/${enrollment.client.id}`} className="text-amber-400 hover:text-amber-300 mr-4">
                      View Client
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}