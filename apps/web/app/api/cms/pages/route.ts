// 🟩 Forzar entorno Node.js para evitar Edge Runtime
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cmsService } from '@/lib/cms-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API] GET /api/cms/pages - Iniciando...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    console.log('✅ [API] Usuario autorizado:', decoded.userId, 'Roles:', decoded.roles);
    
    // Usar el servicio centralizado
    const pages = await cmsService.getAllPages();
    
    console.log('📊 [API] Páginas encontradas:', pages.length);
    console.log('📋 [API] Detalles de páginas:', pages.map(p => ({ 
      id: p.id, 
      title: p.title, 
      status: p.status 
    })));

    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error('❌ [API] Error fetching pages:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, description, status, blocks } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Título y slug son requeridos' }, { status: 400 });
    }

    // Verificar si ya existe
    const exists = await cmsService.pageExists(slug);
    if (exists) {
      return NextResponse.json({ error: 'Ya existe una página con este slug' }, { status: 400 });
    }

    // Usar el servicio centralizado
    // Verificar que organizationId esté definido
    if (!decoded.organizationId) {
      return NextResponse.json(
        { error: 'ID de organización no encontrado' },
        { status: 400 }
      );
    }

    const page = await cmsService.createPage({
      title,
      slug,
      description,
      status,
      blocks,
      createdBy: decoded.userId,
      organizationId: decoded.organizationId
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
