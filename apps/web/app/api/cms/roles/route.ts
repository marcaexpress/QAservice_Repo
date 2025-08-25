// [DEPLOY-FIX] Asegurar que esta route es dinámica y no se intenta prerender
export const dynamic = 'force-dynamic';
export const revalidate = 0; // no cache en build

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Get all roles
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        organizationId: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      roles
    });

  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
