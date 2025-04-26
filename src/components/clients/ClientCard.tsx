// src/components/clients/ClientCard.tsx
'use client';

import Link from 'next/link';
import { Client } from '@prisma/client';

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
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

  return (
    <div className="card group hover:shadow-amber-glow transition-all">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-200 text-xl font-semibold">
          {client.firstName.charAt(0)}{client.lastName.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-amber-200 group-hover:text-amber-100">
            {client.firstName} {client.lastName}
          </h3>
          <div className="flex flex-wrap gap-x-4 text-sm text-gray-300">
            <span>{client.gender}</span>
            <span>{age} years old</span>
            {client.email && <span>{client.email}</span>}
          </div>
        </div>
      </div>
      
      <div className="mt-auto flex justify-end">
        <Link href={`/clients/${client.id}`} className="btn btn-secondary">
          View Profile
        </Link>
      </div>
    </div>
  );
}