import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [API] POST /api/cms/pages/import - Importando página...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { slug, title, description, type, path } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug y título son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe en el CMS
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Esta página ya existe en el CMS' },
        { status: 400 }
      );
    }

    // Crear la página en el CMS
    const page = await prisma.page.create({
      data: {
        title,
        slug,
        description: description || `Página importada de ${path}`,
        status: 'DRAFT',
        published: false,
        blocks: [],
        createdBy: decoded.userId,
        updatedBy: decoded.userId,
        organizationId: decoded.organizationId
      }
    });

    // Crear regla de acceso pública por defecto
    await prisma.pageAccessRule.create({
      data: {
        pageId: page.id,
        accessType: 'PUBLIC',
        permissions: ['VIEW']
      }
    });

    console.log('✅ [API] Página importada exitosamente:', page.title);

    return NextResponse.json({
      success: true,
      message: 'Página importada exitosamente al CMS',
      page
    });

  } catch (error) {
    console.error('❌ [API] Error importing page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
