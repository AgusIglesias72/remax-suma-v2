import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clerkId, email, role, firstName, lastName, profileImage } = body;

    // Verificar que el usuario autenticado coincida con el que se está sincronizando
    if (userId !== clerkId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Buscar si el usuario ya existe en nuestra base de datos
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true }
    });

    if (!user) {
      // Crear nuevo usuario
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          role: role || 'CLIENT',
          profile: {
            create: {
              firstName: firstName || '',
              lastName: lastName || '',
              profileImage,
            }
          }
        },
        include: { profile: true }
      });
    } else {
      // Actualizar usuario existente
      user = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          role: role || user.role,
          lastLoginAt: new Date(),
          profile: {
            upsert: {
              create: {
                firstName: firstName || '',
                lastName: lastName || '',
                profileImage,
              },
              update: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                profileImage: profileImage || undefined,
              }
            }
          }
        },
        include: { profile: true }
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}