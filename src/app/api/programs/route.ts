// src/app/api/programs/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/programs - Fetch all programs (with optional filtering)
export async function GET(request: Request) {
  try {
    // Get URL and parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Build the filter criteria
    const where: any = {};
    
    // Add search filter if query parameter exists
    if (query) {
      where.name = {
        contains: query
      };
    }
    
    // Add active filter unless includeInactive is true
    if (!includeInactive) {
      where.active = true;
    }
    
    // Fetch programs with filtering
    const programs = await prisma.program.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

// POST /api/programs - Create a new program
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Program name is required' },
        { status: 400 }
      );
    }
    
    // Check if program with same name already exists
    const existingProgram = await prisma.program.findUnique({
      where: { name: body.name }
    });
    
    if (existingProgram) {
      return NextResponse.json(
        { error: 'A program with this name already exists' },
        { status: 409 }
      );
    }
    
    // Create new program
    const program = await prisma.program.create({
      data: {
        name: body.name,
        description: body.description || null,
        active: body.active !== undefined ? body.active : true
      }
    });
    
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}