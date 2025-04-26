// src/app/api/clients/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/clients - Fetch all clients (with optional filtering)
export async function GET(request: Request) {
  try {
    // Get URL and parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Build search filters
    const where = query
      ? {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } },
          ],
        }
      : {};

    // Fetch clients with pagination
    const clients = await prisma.client.findMany({
      where,
      orderBy: {
        lastName: 'asc',
      },
      skip,
      take: pageSize,
    });

    // Get total count for pagination
    const total = await prisma.client.count({ where });

    return NextResponse.json({
      clients,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.dateOfBirth || !body.gender) {
      return NextResponse.json(
        { error: 'First name, last name, date of birth, and gender are required' },
        { status: 400 }
      );
    }
    
    // Create new client
    const client = await prisma.client.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
      },
    });
    
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}