// src/components/clients/ClientEnrollments.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Enrollment, Program } from '@prisma/client';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/ui/Modal';
import EnrollClientForm from './EnrollClientForm';

interface EnrollmentWithProgram extends Enrollment {
  program: Program;
}

interface ClientEnrollmentsProps {
  clientId: string;
  clientName: string;
  enrollments: EnrollmentWithProgram[];
}

export default function ClientEnrollments({ clientId, clientName, enrollments }: ClientEnrollmentsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Get existing program IDs to prevent duplicate enrollments
  const existingProgramIds = enrollments.map(enrollment => enrollment.programId);

  const updateEnrollmentStatus = async (enrollmentId: string, newStatus: string) => {
    setProcessingId(enrollmentId);
    
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          endDate: newStatus === 'completed' ? new Date().toISOString() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update enrollment status');
      }

      showToast(`Enrollment status updated to ${newStatus}`, 'success');
      router.refresh();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'An unexpected error occurred',
        'error'
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-200">Health Program Enrollments</h2>
        <button 
          onClick={() => setIsEnrollModalOpen(true)}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Enroll in Program
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-300 mb-4">This client is not enrolled in any health programs yet.</p>
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="btn btn-primary"
          >
            Enroll in Program
          </button>
        </div>
      ) : (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Program
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/programs/${enrollment.programId}`}
                      className="text-amber-200 hover:text-amber-100 font-medium"
                    >
                      {enrollment.program.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      enrollment.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : enrollment.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : enrollment.status === 'canceled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(enrollment.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {enrollment.endDate ? new Date(enrollment.endDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {enrollment.status === 'active' ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => updateEnrollmentStatus(enrollment.id, 'completed')}
                          disabled={!!processingId}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {processingId === enrollment.id ? 'Processing...' : 'Complete'}
                        </button>
                        <button
                          onClick={() => updateEnrollmentStatus(enrollment.id, 'canceled')}
                          disabled={!!processingId}
                          className="text-red-400 hover:text-red-300 ml-3"
                        >
                          {processingId === enrollment.id ? 'Processing...' : 'Cancel'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateEnrollmentStatus(enrollment.id, 'active')}
                        disabled={!!processingId}
                        className="text-green-400 hover:text-green-300"
                      >
                        {processingId === enrollment.id ? 'Processing...' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enroll Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title={`Enroll ${clientName} in Program`}
      >
        <EnrollClientForm 
          clientId={clientId}
          clientName={clientName}
          existingProgramIds={existingProgramIds}
        />
      </Modal>
    </div>
  );
}