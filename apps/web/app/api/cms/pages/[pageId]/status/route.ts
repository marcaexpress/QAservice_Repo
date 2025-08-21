import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
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
    const { status } = body;

    // Validate status
    const validStatuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado no válido. Estados permitidos: DRAFT, REVIEW, PUBLISHED, ARCHIVED' },
        { status: 400 }
      );
    }

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      );
    }

    // Prepare update data
    let updateData: any = {
      status,
      updatedBy: decoded.userId,
      updatedAt: new Date()
    };

    // Handle status-specific logic
    if (status === 'PUBLISHED') {
      // Check if page has content before publishing
      if (!existingPage.blocks || (existingPage.blocks as any[]).length === 0) {
        return NextResponse.json(
          { error: 'No se puede publicar una página sin contenido' },
          { status: 400 }
        );
      }
      
      updateData.published = true;
      updateData.publishedAt = new Date();
    } else {
      // If changing from PUBLISHED to another status, unset published flag
      if (existingPage.status === 'PUBLISHED') {
        updateData.published = false;
        updateData.publishedAt = null;
      }
    }

    // Update page status
    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: `Estado de página cambiado a ${status}`,
      page: updatedPage
    });

  } catch (error) {
    console.error('Error changing page status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
