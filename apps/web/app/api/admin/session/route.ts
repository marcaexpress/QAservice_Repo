import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN] Verificando sesión admin...');
    
    const token = getTokenFromRequest(request);
    console.log('🔑 [ADMIN] Token encontrado:', token ? 'SÍ' : 'NO');
    
    if (!token) {
      console.log('❌ [ADMIN] No se encontró token');
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    console.log('🔐 [ADMIN] Payload verificado:', payload ? 'SÍ' : 'NO');
    
    if (!payload) {
      console.log('❌ [ADMIN] Token inválido o expirado');
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 401 }
      );
    }

    // Verificar que el usuario tiene roles de admin
    const userRoles = payload.roles || [];
    const hasAdminAccess = userRoles.some((role: string) => 
      role === 'Administrador' || role === 'Editor CMS'
    );

    if (!hasAdminAccess) {
      console.log('❌ [ADMIN] Usuario sin permisos de administrador');
      return NextResponse.json(
        { isAuthenticated: false, user: null, error: 'no-permissions' },
        { status: 403 }
      );
    }

    console.log('✅ [ADMIN] Token válido, admin autenticado');
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        roles: payload.roles,
        organizationId: payload.organizationId,
      }
    });

  } catch (error) {
    console.error('💥 [ADMIN] Error verificando sesión:', error);
    return NextResponse.json(
      { isAuthenticated: false, user: null },
      { status: 500 }
    );
  }
}
