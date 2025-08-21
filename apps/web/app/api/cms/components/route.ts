import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API] GET /api/cms/components - Iniciando...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    console.log('✅ [API] Usuario autorizado:', decoded.userId, 'Roles:', decoded.roles);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    let whereClause: any = {};
    
    if (type) whereClause.type = type;
    if (category) whereClause.category = category;
    if (isActive !== null) whereClause.isActive = isActive === 'true';
    whereClause.organizationId = decoded.organizationId;

    const components = await prisma.component.findMany({
      where: whereClause,
      include: {
        properties: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            instances: true,
            versions: true
          }
        }
      },
      orderBy: [
        { type: 'asc' },
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`📊 [API] Componentes encontrados: ${components.length}`);
    
    return NextResponse.json({
      success: true,
      components,
      count: components.length
    });

  } catch (error) {
    console.error('❌ [API] Error fetching components:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [API] POST /api/cms/components - Creando componente...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { name, type, category, description, properties } = body;

    // Validaciones
    if (!name || !type || !category) {
      return NextResponse.json(
        { error: 'Nombre, tipo y categoría son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el nombre sea único
    const existingComponent = await prisma.component.findUnique({
      where: { name }
    });

    if (existingComponent) {
      return NextResponse.json(
        { error: 'Ya existe un componente con ese nombre' },
        { status: 400 }
      );
    }

    // Crear el componente con sus propiedades
    const component = await prisma.component.create({
      data: {
        name,
        type,
        category,
        description,
        isActive: true,
        organizationId: decoded.organizationId,
        properties: {
          create: properties?.map((prop: any, index: number) => ({
            name: prop.name,
            type: prop.type,
            value: prop.value,
            required: prop.required || false,
            options: prop.options || [],
            order: prop.order || index + 1,
            minLength: prop.minLength,
            maxLength: prop.maxLength,
            minValue: prop.minValue,
            maxValue: prop.maxValue
          })) || []
        }
      },
      include: {
        properties: {
          orderBy: { order: 'asc' }
        }
      }
    });

    console.log(`✅ [API] Componente creado: ${component.name}`);
    
    return NextResponse.json({
      success: true,
      component,
      message: 'Componente creado exitosamente'
    });

  } catch (error) {
    console.error('❌ [API] Error creating component:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
