import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { pageId } = params;
    if (!pageId) {
      return NextResponse.json({ error: 'ID de página requerido' }, { status: 400 });
    }

    // Get access rules with related data
    const accessRules = await prisma.pageAccessRule.findMany({
      where: { pageId },
      include: {
        role: {
          select: { id: true, name: true, description: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        },
        organization: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      accessRules
    });

  } catch (error) {
    console.error('Error getting access rules:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { pageId } = params;
    if (!pageId) {
      return NextResponse.json({ error: 'ID de página requerido' }, { status: 400 });
    }

    const body = await request.json();
    const { accessType, roleId, userId, organizationId, permissions } = body;

    // Validate required fields
    if (!accessType || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Tipo de acceso y permisos son requeridos' },
        { status: 400 }
      );
    }

    // Validate access type specific fields
    if (accessType === 'ROLE_BASED' && !roleId) {
      return NextResponse.json(
        { error: 'ID de rol requerido para acceso basado en rol' },
        { status: 400 }
      );
    }

    if (accessType === 'USER_SPECIFIC' && !userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido para acceso específico de usuario' },
        { status: 400 }
      );
    }

    if (accessType === 'ORGANIZATION' && !organizationId) {
      return NextResponse.json(
        { error: 'ID de organización requerido para acceso de organización' },
        { status: 400 }
      );
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      );
    }

    // Create access rule
    const accessRule = await prisma.pageAccessRule.create({
      data: {
        pageId,
        accessType,
        roleId: accessType === 'ROLE_BASED' ? roleId : null,
        userId: accessType === 'USER_SPECIFIC' ? userId : null,
        organizationId: accessType === 'ORGANIZATION' ? organizationId : null,
        permissions: permissions as any
      },
      include: {
        role: {
          select: { id: true, name: true, description: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        },
        organization: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Regla de acceso creada exitosamente',
      accessRule
    });

  } catch (error) {
    console.error('Error creating access rule:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
