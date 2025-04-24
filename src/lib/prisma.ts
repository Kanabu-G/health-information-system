// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Create a global variable to store the Prisma client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Export a Prisma client instance. Use the existing one if it exists (useful for hot reloading during development)
export const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, store the Prisma client instance in a global variable to prevent multiple instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;