// src/components/clients/EnrollClientForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Program } from '@prisma/client';
import { useToast } from '@/contexts/ToastContext';

interface EnrollClientFormProps {
  clientId: string;
  clientName: string;
  existingProgramIds?: string[];
}

export default function EnrollClientForm({ clientId, clientName, existingProgramIds = [] }: EnrollClientFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    programId: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Fetch available programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setFetchingPrograms(true);
        const response = await fetch('/api/programs?includeInactive=false');
        
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        
        const data = await response.json();
        
        // Filter out programs the client is already enrolled in
        const availablePrograms = data.filter((program: Program) => 
          !existingProgramIds.includes(program.id)
        );
        
        setPrograms(availablePrograms);
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setFetchingPrograms(false);
      }
    };
    
    fetchPrograms();
  }, [existingProgramIds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.programId) {
      setError('Please select a program');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          programId: formData.programId,
          startDate: formData.startDate,
          notes: formData.notes,
          status: 'active'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll client');
      }

      const programName = programs.find(p => p.id === formData.programId)?.name || 'program';
      
      // Show success toast
      showToast(`${clientName} enrolled in ${programName} successfully!`, 'success');
      
      // Refresh and close the modal
      router.refresh();
      
      // Reset form
      setFormData({
        programId: '',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="programId" className="block text-amber-200 font-medium">
          Select Program *
        </label>
        {fetchingPrograms ? (
          <div className="animate-pulse h-10 bg-gray-700/50 rounded"></div>
        ) : programs.length === 0 ? (
          <div className="text-gray-300 italic">No available programs for enrollment</div>
        ) : (
          <select
            id="programId"
            name="programId"
            value={formData.programId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="startDate" className="block text-amber-200 font-medium">
          Start Date *
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-amber-200 font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading || fetchingPrograms || programs.length === 0}
          className="btn btn-primary"
        >
          {loading ? 'Enrolling...' : 'Enroll Client'}
        </button>
      </div>
    </form>
  );
}