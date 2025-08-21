import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { componentId: string } }
) {
  try {
    console.log('🔍 [API] GET /api/cms/components/[componentId] - Iniciando...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { componentId } = params;

    const component = await prisma.component.findUnique({
      where: { id: componentId },
      include: {
        properties: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!component) {
      return NextResponse.json({ error: 'Componente no encontrado' }, { status: 404 });
    }

    // Verificar que el componente pertenece a la organización del usuario
    if (component.organizationId !== decoded.organizationId) {
      return NextResponse.json({ error: 'Acceso denegado al componente' }, { status: 403 });
    }

    if (!component) {
      return NextResponse.json({ error: 'Componente no encontrado' }, { status: 404 });
    }

    console.log(`✅ [API] Componente encontrado: ${component.name}`);
    
    return NextResponse.json({
      success: true,
      component
    });

  } catch (error) {
    console.error('❌ [API] Error fetching component:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
