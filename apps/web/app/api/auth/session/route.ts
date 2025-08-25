import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando sesión...');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const token = getTokenFromRequest(request);
    console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');

    // Solo validar el token si viene de auth-token (no _vercel_jwt)
    const cookieHeader = request.headers.get('cookie') || '';
    const isAuthToken = cookieHeader.includes('auth-token=');

    if (!token || !isAuthToken) {
      console.log('❌ No se encontró token propio o el token es de Vercel');
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    console.log('🔐 Payload verificado:', payload ? 'SÍ' : 'NO');

    if (!payload) {
      console.log('❌ Token inválido o expirado');
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 401 }
      );
    }

    console.log('✅ Token válido, usuario autenticado');
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
    console.error('💥 Error verificando sesión:', error);
    return NextResponse.json(
      { isAuthenticated: false, user: null },
      { status: 500 }
    );
  }
}
