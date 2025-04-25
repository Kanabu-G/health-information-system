// src/app/api/programs/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/programs/[id] - Fetch a program by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        // Include count of enrollments
        _count: {
          select: { enrollments: true }
        }
      }
    });
    
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

// PUT /api/programs/[id] - Update a program
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id }
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    // Check for name conflict if name is being updated
    if (body.name && body.name !== existingProgram.name) {
      const nameExists = await prisma.program.findUnique({
        where: { name: body.name }
      });
      
      if (nameExists) {
        return NextResponse.json(
          { error: 'A program with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update program
    const updatedProgram = await prisma.program.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        description: body.description !== undefined ? body.description : undefined,
        active: body.active !== undefined ? body.active : undefined
      }
    });
    
    return NextResponse.json(updatedProgram);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// DELETE /api/programs/[id] - Delete a program
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if program exists
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        enrollments: true
      }
    });
    
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    // Check if program has enrollments
    if (program.enrollments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete program with active enrollments' },
        { status: 400 }
      );
    }
    
    // Delete program
    await prisma.program.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}