// [DEPLOY-FIX] Asegurar que esta route es dinámica y no se intenta prerender
export const dynamic = 'force-dynamic';
export const revalidate = 0; // no cache en build

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // [DEPLOY-FIX] Saltar pruebas automáticas en build/producción
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ ok: true, skipped: 'disabled in production build' }, { status: 200 });
  }

  try {
    console.log('🧪 [API] GET /api/cms/components/test - Probando componentes...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener todos los componentes con sus propiedades
    const components = await prisma.component.findMany({
      where: { organizationId: decoded.organizationId },
      include: {
        properties: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log(`✅ [API] Componentes encontrados: ${components.length}`);
    
    // Crear un componente de prueba si no hay ninguno
    if (components.length === 0) {
      console.log('🔧 [API] Creando componente de prueba...');
      
      // Verificar que organizationId esté definido
      if (!decoded.organizationId) {
        return NextResponse.json(
          { error: 'ID de organización no encontrado' },
          { status: 400 }
        );
      }
      
      const testComponent = await prisma.component.create({
        data: {
          name: 'test_button',
          type: 'ui',
          category: 'interaction',
          description: 'Botón de prueba',
          isActive: true,
          organizationId: decoded.organizationId,
          properties: {
            create: [
              { name: 'text', type: 'string', value: 'Botón de Prueba', required: true, order: 1 },
              { name: 'color', type: 'color', value: '#007bff', required: false, order: 2 },
              { name: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'], required: false, order: 3 }
            ]
          }
        },
        include: {
          properties: {
            orderBy: { order: 'asc' }
          }
        }
      });
      
      console.log(`✅ [API] Componente de prueba creado: ${testComponent.name}`);
      return NextResponse.json({
        success: true,
        message: 'Componente de prueba creado',
        component: testComponent
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Componentes cargados correctamente',
      components: components.map(comp => ({
        id: comp.id,
        name: comp.name,
        type: comp.type,
        category: comp.category,
        description: comp.description,
        propertiesCount: comp.properties.length,
        properties: comp.properties
      }))
    });

  } catch (error) {
    console.error('❌ [API] Error en test de componentes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
