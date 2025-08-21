import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Check if page has content (blocks)
    if (!existingPage.blocks || (existingPage.blocks as any[]).length === 0) {
      return NextResponse.json(
        { error: 'No se puede publicar una página sin contenido' },
        { status: 400 }
      );
    }

    // Create a new version before publishing
    const latestVersion = await prisma.pageVersion.findFirst({
      where: { pageId },
      orderBy: { version: 'desc' }
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;

    await prisma.pageVersion.create({
      data: {
        pageId,
        version: newVersionNumber,
        title: existingPage.title,
        description: existingPage.description,
        blocks: existingPage.blocks,
        metadata: {
          changeNotes: 'Publicación automática',
          author: decoded.name,
          timestamp: new Date().toISOString(),
          action: 'PUBLISH'
        },
        creator: decoded.userId
      }
    });

    // Publish the page
    const publishedPage = await prisma.page.update({
      where: { id: pageId },
      data: {
        status: 'PUBLISHED',
        published: true,
        publishedAt: new Date(),
        updatedBy: decoded.userId,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Página publicada exitosamente',
      page: publishedPage,
      version: newVersionNumber
    });

  } catch (error) {
    console.error('Error publishing page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
