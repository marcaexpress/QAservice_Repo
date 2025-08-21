import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API] GET /api/cms/components/instances - Iniciando...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const componentId = searchParams.get('componentId');

    let whereClause: any = {};
    
    if (pageId) whereClause.pageId = pageId;
    if (componentId) whereClause.componentId = componentId;

    const instances = await prisma.componentInstance.findMany({
      where: whereClause,
      include: {
        component: {
          include: {
            properties: {
              orderBy: { order: 'asc' }
            }
          }
        },
        page: {
          select: { title: true }
        },
        parent: {
          select: { id: true, component: { select: { name: true } } }
        },
        children: {
          include: {
            component: {
              select: { name: true, type: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { pageId: 'asc' },
        { order: 'asc' }
      ]
    });

    console.log(`📊 [API] Instancias encontradas: ${instances.length}`);
    
    return NextResponse.json({
      success: true,
      instances,
      count: instances.length
    });

  } catch (error) {
    console.error('❌ [API] Error fetching component instances:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [API] POST /api/cms/components/instances - Creando instancia...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { componentId, pageId, data, order, parentId } = body;

    // Validaciones
    if (!componentId) {
      return NextResponse.json(
        { error: 'ID del componente es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el componente existe
    const component = await prisma.component.findUnique({
      where: { id: componentId },
      include: { properties: true }
    });

    if (!component) {
      return NextResponse.json(
        { error: 'Componente no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la página existe si se especifica
    if (pageId) {
      const page = await prisma.page.findUnique({
        where: { id: pageId }
      });

      if (!page) {
        return NextResponse.json(
          { error: 'Página no encontrada' },
          { status: 404 }
        );
      }
    }

    // Verificar que el padre existe si se especifica
    if (parentId) {
      const parent = await prisma.componentInstance.findUnique({
        where: { id: parentId }
      });

      if (!parent) {
        return NextResponse.json(
          { error: 'Instancia padre no encontrada' },
          { status: 404 }
        );
      }
    }

    // Crear la instancia
    const instance = await prisma.componentInstance.create({
      data: {
        componentId,
        pageId: pageId || null,
        data: data || {},
        order: order || 0,
        parentId: parentId || null
      },
      include: {
        component: {
          include: {
            properties: {
              orderBy: { order: 'asc' }
            }
          }
        },
        page: {
          select: { title: true }
        },
        parent: {
          select: { id: true, component: { select: { name: true } } }
        }
      }
    });

    console.log(`✅ [API] Instancia creada: ${instance.component.name}`);
    
    return NextResponse.json({
      success: true,
      instance,
      message: 'Instancia de componente creada exitosamente'
    });

  } catch (error) {
    console.error('❌ [API] Error creating component instance:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
