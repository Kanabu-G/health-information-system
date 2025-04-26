// src/app/api/enrollments/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST /api/enrollments - Create a new enrollment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.clientId || !body.programId) {
      return NextResponse.json(
        { error: 'Client ID and Program ID are required' },
        { status: 400 }
      );
    }
    
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: body.clientId },
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Check if program exists and is active
    const program = await prisma.program.findUnique({
      where: { id: body.programId },
    });
    
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    if (!program.active) {
      return NextResponse.json(
        { error: 'Cannot enroll in inactive program' },
        { status: 400 }
      );
    }
    
    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        clientId: body.clientId,
        programId: body.programId,
        status: 'active',
      },
    });
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Client is already enrolled in this program' },
        { status: 409 }
      );
    }
    
    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        clientId: body.clientId,
        programId: body.programId,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status || 'active',
        notes: body.notes || null,
      },
      include: {
        client: true,
        program: true,
      },
    });
    
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}