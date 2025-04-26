// src/app/clients/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ClientEnrollments from '@/components/clients/ClientEnrollments';
import DeleteClientButton from '@/components/clients/DeleteClientButton';

export const dynamic = 'force-dynamic';

interface ClientPageProps {
  params: {
    id: string;
  };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          program: true
        },
        orderBy: {
          startDate: 'desc'
        }
      }
    }
  });

  if (!client) {
    notFound();
  }

  // Calculate age from date of birth
  const calculateAge = (dob: Date): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const age = calculateAge(client.dateOfBirth);
  const clientFullName = `${client.firstName} ${client.lastName}`;

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

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-200 text-2xl font-semibold mr-6">
              {client.firstName.charAt(0)}{client.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-amber-200 mb-2">{clientFullName}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-gray-300">
                <div>
                  <span className="text-gray-400">Gender:</span> {client.gender}
                </div>
                <div>
                  <span className="text-gray-400">Age:</span> {age} years
                </div>
                <div>
                  <span className="text-gray-400">Date of Birth:</span> {new Date(client.dateOfBirth).toLocaleDateString()}
                </div>
                {client.email && (
                  <div>
                    <span className="text-gray-400">Email:</span> {client.email}
                  </div>
                )}
                {client.phone && (
                  <div>
                    <span className="text-gray-400">Phone:</span> {client.phone}
                  </div>
                )}
                {client.address && (
                  <div className="col-span-full">
                    <span className="text-gray-400">Address:</span> {client.address}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link 
              href={`/clients/${client.id}/edit`}
              className="btn btn-secondary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <DeleteClientButton clientId={client.id} clientName={clientFullName} />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <ClientEnrollments 
          clientId={client.id} 
          clientName={clientFullName}
          enrollments={client.enrollments}
        />
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-amber-200">API Access Information</h2>
        </div>
        <p className="text-gray-300 mb-4">
          External systems can access this client's profile data through the following API endpoint:
        </p>
        <div className="bg-gray-900 p-3 rounded-md overflow-x-auto">
          <code className="text-amber-200 text-sm">
            GET /api/external/clients/{client.id}
          </code>
        </div>
        <p className="text-gray-300 mt-4 text-sm">
          This endpoint provides client information and their program enrollments in a structured JSON format.
        </p>
      </div>
    </div>
  );
}