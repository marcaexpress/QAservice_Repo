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

    // Get page with all related data
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        accessRules: {
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
        },
        versions: {
          orderBy: { version: 'desc' },
          take: 10
        }
      }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page
    });

  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { title, slug, description, status, blocks } = body;

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

    // Check if slug already exists (if changed)
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ya existe una página con este slug' },
          { status: 400 }
        );
      }
    }

    // Validate status transition
    const validStatuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado no válido' },
        { status: 400 }
      );
    }

    // Handle status-specific logic
    let updateData: any = {
      title: title || existingPage.title,
      slug: slug || existingPage.slug,
      description: description !== undefined ? description : existingPage.description,
      status: status || existingPage.status,
      blocks: blocks || existingPage.blocks,
      updatedBy: decoded.userId,
      updatedAt: new Date()
    };

    // If status is being changed to PUBLISHED, set published flag
    if (status === 'PUBLISHED' && existingPage.status !== 'PUBLISHED') {
      updateData.published = true;
      updateData.publishedAt = new Date();
    }

    // If status is being changed from PUBLISHED to something else, unset published flag
    if (existingPage.status === 'PUBLISHED' && status !== 'PUBLISHED') {
      updateData.published = false;
      updateData.publishedAt = null;
    }

    // Update page
    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Página actualizada exitosamente',
      page: updatedPage
    });

  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Delete page (this will cascade delete access rules and versions)
    await prisma.page.delete({
      where: { id: pageId }
    });

    return NextResponse.json({
      success: true,
      message: 'Página eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
