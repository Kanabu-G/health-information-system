// src/components/clients/CreateClientForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export default function CreateClientForm() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client');
      }

      // Show success toast
      showToast(`Client ${data.firstName} ${data.lastName} registered successfully!`, 'success');
      
      // Redirect to the client detail page after a brief delay
      setTimeout(() => {
        router.push(`/clients/${data.id}`);
        router.refresh();
      }, 1000);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-amber-200 font-medium">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-amber-200 font-medium">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="block text-amber-200 font-medium">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gender" className="block text-amber-200 font-medium">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-amber-200 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-amber-200 font-medium">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="block text-amber-200 font-medium">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500/20"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Registering...' : 'Register Client'}
        </button>
      </div>
    </form>
  );
}