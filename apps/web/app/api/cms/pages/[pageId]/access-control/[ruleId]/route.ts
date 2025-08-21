import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string; ruleId: string } }
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

    const { pageId, ruleId } = params;
    if (!pageId || !ruleId) {
      return NextResponse.json(
        { error: 'ID de página y regla son requeridos' },
        { status: 400 }
      );
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

    // Check if access rule exists
    const existingRule = await prisma.pageAccessRule.findUnique({
      where: { id: ruleId }
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: 'Regla de acceso no encontrada' },
        { status: 404 }
      );
    }

    // Check if rule belongs to the specified page
    if (existingRule.pageId !== pageId) {
      return NextResponse.json(
        { error: 'La regla de acceso no pertenece a esta página' },
        { status: 400 }
      );
    }

    // Update access rule
    const updatedRule = await prisma.pageAccessRule.update({
      where: { id: ruleId },
      data: {
        accessType,
        roleId: accessType === 'ROLE_BASED' ? roleId : null,
        userId: accessType === 'USER_SPECIFIC' ? userId : null,
        organizationId: accessType === 'ORGANIZATION' ? organizationId : null,
        permissions: permissions as any,
        updatedAt: new Date()
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
      message: 'Regla de acceso actualizada exitosamente',
      accessRule: updatedRule
    });

  } catch (error) {
    console.error('Error updating access rule:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string; ruleId: string } }
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

    const { pageId, ruleId } = params;
    if (!pageId || !ruleId) {
      return NextResponse.json(
        { error: 'ID de página y regla son requeridos' },
        { status: 400 }
      );
    }

    // Check if access rule exists
    const existingRule = await prisma.pageAccessRule.findUnique({
      where: { id: ruleId }
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: 'Regla de acceso no encontrada' },
        { status: 404 }
      );
    }

    // Check if rule belongs to the specified page
    if (existingRule.pageId !== pageId) {
      return NextResponse.json(
        { error: 'La regla de acceso no pertenece a esta página' },
        { status: 400 }
      );
    }

    // Delete access rule
    await prisma.pageAccessRule.delete({
      where: { id: ruleId }
    });

    return NextResponse.json({
      success: true,
      message: 'Regla de acceso eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting access rule:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
