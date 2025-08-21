import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [API] POST /api/cms/pages/sync-status - Sincronizando estados...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    console.log('✅ [API] Usuario autorizado:', decoded.userId, 'Roles:', decoded.roles);
    
    // Lista de páginas que sabemos que están publicadas
    const publishedPages = [
      'home',           // Página principal
      'servicios',      // Página de servicios
      'contacto',       // Página de contacto
      'aprendizaje',    // Página de aprendizaje
      'cms',           // CMS público
      'admin',          // Admin principal
      'admin-cms',      // CMS del admin
      'admin-login',    // Login del admin
      'auth-login',     // Login de usuarios
      'auth-registro'   // Registro de usuarios
    ];

    let updatedCount = 0;

    // Actualizar páginas conocidas como publicadas
    for (const slug of publishedPages) {
      try {
        const page = await prisma.page.findUnique({ where: { slug } });
        if (page && page.status !== 'PUBLISHED') {
          console.log(`🔄 [API] Actualizando ${page.title}: ${page.status} → PUBLISHED`);
          
          await prisma.page.update({
            where: { id: page.id },
            data: { 
              status: 'PUBLISHED',
              publishedAt: new Date(),
              updatedAt: new Date()
            }
          });

          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ [API] Error actualizando ${slug}:`, error);
      }
    }

    // Obtener estadísticas finales
    const finalPages = await prisma.page.findMany({
      select: { status: true }
    });

    const stats = {
      total: finalPages.length,
      published: finalPages.filter(p => p.status === 'PUBLISHED').length,
      review: finalPages.filter(p => p.status === 'REVIEW').length,
      draft: finalPages.filter(p => p.status === 'DRAFT').length,
      archived: finalPages.filter(p => p.status === 'ARCHIVED').length
    };

    console.log('📊 [API] Sincronización completada:', {
      actualizadas: updatedCount,
      estadisticas: stats
    });

    return NextResponse.json({
      success: true,
      message: 'Estados sincronizados exitosamente',
      updatedCount,
      stats
    });

  } catch (error) {
    console.error('❌ [API] Error durante la sincronización de estados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor durante la sincronización' },
      { status: 500 }
    );
  }
}
