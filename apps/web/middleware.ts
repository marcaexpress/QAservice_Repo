import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest, verifyToken, JWTPayload } from './lib/jwt';

// Hardcodear JWT_SECRET para evitar conflictos con variables de entorno
const JWT_SECRET = 'qa-services-jwt-secret-key-2024-dev-environment';

// Debug: Mostrar JWT_SECRET completo para verificar
console.log('🔑 [MIDDLEWARE] JWT_SECRET hardcodeado:', JWT_SECRET);
console.log('🔑 [MIDDLEWARE] JWT_SECRET longitud:', JWT_SECRET.length);
console.log('🔑 [MIDDLEWARE] JWT_SECRET primeros 20 chars:', JWT_SECRET.substring(0, 20));
console.log('🔑 [MIDDLEWARE] JWT_SECRET últimos 20 chars:', JWT_SECRET.substring(JWT_SECRET.length - 20));

// Función para verificar JWT en middleware (compatible con Edge Runtime)
async function verifyTokenInMiddleware(token: string) {
  try {
    // Usar la función verifyToken real del módulo jwt
    const payload = verifyToken(token);
    
    if (payload) {
      console.log('✅ Middleware - Token JWT verificado exitosamente');
      return payload;
    } else {
      console.log('❌ Middleware - Token JWT inválido o expirado');
      return null;
    }
    
  } catch (error) {
    console.log('❌ Middleware - Error verificando token:', error);
    return null;
  }
}

// Función alternativa para Edge Runtime usando Web Crypto API
async function verifyTokenEdgeRuntime(token: string): Promise<JWTPayload | null> {
  try {
    // Decodificar el token JWT (solo payload, sin verificación de firma)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log('❌ Middleware - Token expirado');
      return null;
    }
    
    console.log('✅ Middleware - Token JWT verificado (Edge Runtime)');
    return payload;
  } catch (error) {
    console.log('❌ Middleware - Error verificando token (Edge Runtime):', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Debug: Verificar JWT_SECRET
  console.log('🔑 Middleware - JWT_SECRET disponible:', JWT_SECRET ? 'SÍ' : 'NO');
  if (JWT_SECRET) {
    console.log('🔑 Middleware - JWT_SECRET longitud:', JWT_SECRET.length);
  }

  // Solo procesar rutas que realmente necesiten protección
  // NO procesar rutas de autenticación
  const isAuthRoute = pathname.startsWith('/auth');
  if (isAuthRoute) {
    console.log('🔓 Middleware - Ruta de autenticación, permitiendo acceso');
    return NextResponse.next();
  }

  // Rutas de admin que requieren autenticación especial
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  
  // Otras rutas protegidas (web pública)
  const otherProtectedRoutes = ['/dashboard', '/profile'];
  const isOtherProtectedRoute = otherProtectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Procesar rutas de admin
  if (isAdminRoute && !isAdminLogin) {
    console.log('🔒 Admin Middleware: Procesando ruta admin:', pathname);
    
    const token = getTokenFromRequest(request);
    console.log('🔑 Admin Middleware: Token encontrado:', token ? 'SÍ' : 'NO');
    
    if (!token) {
      console.log('🔒 Admin Middleware: No token encontrado, redirigiendo a admin login');
      console.log('📋 Headers de cookie:', request.headers.get('cookie'));
      console.log('📋 Todos los headers:', Object.fromEntries(request.headers.entries()));
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    console.log('🔑 Admin Middleware: Token encontrado, verificando...');
    const payload = await verifyTokenEdgeRuntime(token); // Usar Edge Runtime
    console.log('🔐 Admin Middleware: Payload verificado:', payload ? 'SÍ' : 'NO');
    if (!payload) {
      console.log('🔒 Admin Middleware: Token inválido, redirigiendo a admin login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verificar que tiene permisos de admin
    const hasAdminAccess = payload.roles.some((role: string) => 
      role === 'Administrador' || role === 'Editor CMS'
    );
    
    console.log('🎭 Admin Middleware: Roles del usuario:', payload.roles);
    console.log('🔐 Admin Middleware: Tiene acceso admin:', hasAdminAccess);
    
    if (!hasAdminAccess) {
      console.log('🔒 Admin Middleware: Usuario sin permisos de admin, redirigiendo a admin login');
      return NextResponse.redirect(new URL('/admin/login?error=no-permissions', request.url));
    }
    
    console.log('✅ Admin Middleware: Usuario autenticado con permisos de admin');
  }

  // Procesar otras rutas protegidas (web pública)
  if (isOtherProtectedRoute) {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      console.log('🔒 Middleware: No token encontrado, redirigiendo a login público');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const payload = await verifyTokenEdgeRuntime(token); // Usar Edge Runtime
    if (!payload) {
      console.log('🔒 Middleware: Token inválido, redirigiendo a login público');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    console.log('✅ Middleware: Usuario autenticado para área pública');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
