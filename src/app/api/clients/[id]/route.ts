// src/app/api/clients/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/clients/[id] - Fetch a client by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            program: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
      },
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update a client
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id }
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Update client
    const client = await prisma.client.update({
      where: { id },
      data: {
        firstName: body.firstName !== undefined ? body.firstName : undefined,
        lastName: body.lastName !== undefined ? body.lastName : undefined,
        dateOfBirth: body.dateOfBirth !== undefined ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender !== undefined ? body.gender : undefined,
        email: body.email !== undefined ? body.email : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        address: body.address !== undefined ? body.address : undefined,
      },
    });
    
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        enrollments: true,
      },
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Delete the client (enrollments will be deleted due to cascading)
    await prisma.client.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}