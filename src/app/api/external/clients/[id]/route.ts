// src/app/api/external/clients/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/external/clients/{id}:
 *   get:
 *     summary: Get client profile by ID
 *     description: Retrieves detailed client information including enrollment in health programs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                 gender:
 *                   type: string
 *                 programs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       status:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */

// GET /api/external/clients/[id] - External API for client profile
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find client with enrollments
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
    
    // Format the response for external consumption
    // This allows us to control exactly what data is exposed externally
    const formattedResponse = {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      dateOfBirth: client.dateOfBirth,
      gender: client.gender,
      // Only include public contact info if available
      contactInfo: client.email || client.phone ? {
        email: client.email,
        phone: client.phone,
      } : null,
      // Format programs for simplified external consumption
      programs: client.enrollments.map(enrollment => ({
        id: enrollment.program.id,
        name: enrollment.program.name,
        status: enrollment.status,
        startDate: enrollment.startDate,
        endDate: enrollment.endDate,
      })),
    };
    
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client profile' },
      { status: 500 }
    );
  }
}