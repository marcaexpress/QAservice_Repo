import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API] GET /api/cms/pages/discover - Descubriendo páginas...');
    
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.roles.some(role => ['Administrador', 'Editor CMS'].includes(role))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Descubrir páginas del proyecto Next.js
    const discoveredPages = await discoverProjectPages();
    
    // Obtener páginas existentes del CMS
    const existingCMSPages = await prisma.page.findMany({
              select: { title: true, id: true }
    });

    // Crear un mapa de páginas CMS existentes
    const cmsPagesMap = new Map(existingCMSPages.map(p => [p.slug, p]));

    // Combinar páginas descubiertas con estado del CMS
    const allPages = discoveredPages.map(page => ({
      ...page,
      isInCMS: cmsPagesMap.has(page.slug),
      cmsPageId: cmsPagesMap.get(page.slug)?.id || null,
      cmsTitle: cmsPagesMap.get(page.slug)?.title || page.title
    }));

    console.log('📊 [API] Páginas descubiertas:', allPages.length);
    console.log('📋 [API] Detalles:', allPages.map(p => ({ 
      path: p.path, 
      slug: p.slug, 
      isInCMS: p.isInCMS 
    })));

    return NextResponse.json({
      success: true,
      pages: allPages
    });

  } catch (error) {
    console.error('❌ [API] Error discovering pages:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function discoverProjectPages() {
  const pages: Array<{
    path: string;
    slug: string;
    title: string;
    type: 'public' | 'admin' | 'cms';
    description: string;
  }> = [];

  try {
    // Páginas públicas principales
    const publicPages = [
      { path: '/', slug: 'home', title: 'Página Principal', type: 'public' as const, description: 'Página de inicio del sitio' },
      { path: '/servicios', slug: 'servicios', title: 'Servicios', type: 'public' as const, description: 'Página de servicios de QA' },
      { path: '/contacto', slug: 'contacto', title: 'Contacto', type: 'public' as const, description: 'Página de contacto' },
      { path: '/aprendizaje', slug: 'aprendizaje', title: 'Aprendizaje', type: 'public' as const, description: 'Página de aprendizaje' },
      { path: '/cms', slug: 'cms', title: 'CMS Público', type: 'public' as const, description: 'Vista pública del CMS' },
      { path: '/preview', slug: 'preview', title: 'Vista Previa', type: 'public' as const, description: 'Vista previa de páginas' }
    ];

    // Páginas de administración
    const adminPages = [
      { path: '/admin', slug: 'admin', title: 'Admin Dashboard', type: 'admin' as const, description: 'Panel principal de administración' },
      { path: '/admin/dashboard', slug: 'admin-dashboard', title: 'Dashboard', type: 'admin' as const, description: 'Dashboard principal del admin' },
      { path: '/admin/cms', slug: 'admin-cms', title: 'CMS Editor', type: 'admin' as const, description: 'Editor del sistema CMS' },
      { path: '/admin/login', slug: 'admin-login', title: 'Login Admin', type: 'admin' as const, description: 'Página de login para administradores' },
      { path: '/admin/basic-test', slug: 'admin-basic-test', title: 'Test Básico', type: 'admin' as const, description: 'Página de test básico' },
      { path: '/admin/component-test', slug: 'admin-component-test', title: 'Test de Componentes', type: 'admin' as const, description: 'Página de test de componentes' },
      { path: '/admin/public-test', slug: 'admin-public-test', title: 'Test Público', type: 'admin' as const, description: 'Página de test público' },
      { path: '/admin/simple-test', slug: 'admin-simple-test', title: 'Test Simple', type: 'admin' as const, description: 'Página de test simple' },
      { path: '/admin/cms-test', slug: 'admin-cms-test', title: 'Test CMS', type: 'admin' as const, description: 'Página de test del CMS' },
      { path: '/admin/test-simple', slug: 'admin-test-simple', title: 'Test Simple Admin', type: 'admin' as const, description: 'Página de test simple del admin' },
      { path: '/admin/debug', slug: 'admin-debug', title: 'Debug', type: 'admin' as const, description: 'Página de debug del sistema' }
    ];

    // Páginas de autenticación
    const authPages = [
      { path: '/auth/login', slug: 'auth-login', title: 'Login', type: 'public' as const, description: 'Página de login de usuarios' },
      { path: '/auth/registro', slug: 'auth-registro', title: 'Registro', type: 'public' as const, description: 'Página de registro de usuarios' }
    ];

    // Combinar todas las páginas
    pages.push(...publicPages, ...adminPages, ...authPages);

    // Verificar si existen físicamente en el sistema de archivos
    const appDir = path.join(process.cwd(), 'apps', 'web', 'app');
    
    for (const page of pages) {
      try {
        const pagePath = page.path === '/' ? 'page.tsx' : page.path.replace('/', '') + '/page.tsx';
        const fullPath = path.join(appDir, pagePath);
        
        if (fs.existsSync(fullPath)) {
          page.description += ' (Archivo físico encontrado)';
        } else {
          page.description += ' (Archivo físico no encontrado)';
        }
      } catch (error) {
        page.description += ' (Error al verificar archivo)';
      }
    }

  } catch (error) {
    console.error('Error discovering project pages:', error);
  }

  return pages;
}
