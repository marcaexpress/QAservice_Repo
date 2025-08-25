import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// [DEPLOY-FIX] libs/secrets.ts centralizado
function getJwtSecret(): string {
  const s = process.env.JWT_SECRET || 'qa-services-jwt-secret-key-2024-dev-environment';
  if (!s || s.length < 32) throw new Error("JWT_SECRET missing/weak");
  return s;
}

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRES_IN = '7d'; // 7 días

// [DEPLOY-FIX] NO loguear secretos en producción
if (process.env.NODE_ENV !== 'production') {
  // console.log('🔑 [JWT-LIB] JWT_SECRET hardcodeado:', JWT_SECRET); // Comentado
  // console.log('🔑 [JWT-LIB] JWT_SECRET longitud:', JWT_SECRET.length); // Comentado
  // console.log('🔑 [JWT-LIB] JWT_SECRET primeros 20 chars:', JWT_SECRET.substring(0, 20)); // Comentado
  // console.log('🔑 [JWT-LIB] JWT_SECRET últimos 20 chars:', JWT_SECRET.substring(JWT_SECRET.length - 20)); // Comentado
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  roles: string[];
  organizationId?: string;
}

export function generateToken(payload: JWTPayload): string {
  // [DEPLOY-FIX] NO loguear secretos en producción
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔑 [GENERATE] Generando token con payload:', JSON.stringify(payload, null, 2));
    // console.log('🔑 [GENERATE] Usando JWT_SECRET:', JWT_SECRET); // Comentado
    // console.log('🔑 [GENERATE] JWT_SECRET longitud:', JWT_SECRET.length); // Comentado
  }
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ [GENERATE] Token generado exitosamente');
    console.log('🔑 [GENERATE] Token (primeros 50 chars):', token.substring(0, 50) + '...');
  }
  
  return token;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    // Detectar si el token es de Vercel (audience contiene "vercel")
    if (token && token.startsWith('eyJ')) {
      const decoded = jwt.decode(token, { complete: true });
      if (decoded && typeof decoded === 'object' && decoded['payload'] && decoded['payload']['aud'] && String(decoded['payload']['aud']).includes('vercel')) {
        // Token de Vercel: no verificar la firma, rechazar para lógica propia
        if (process.env.NODE_ENV !== 'production') {
          console.log('❌ [VERIFY] Token de Vercel detectado, no se verifica con JWT_SECRET');
        }
        return null;
      }
    }
    // Verificar con nuestra clave solo si no es de Vercel
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 [VERIFY] Verificando token:', token.substring(0, 50) + '...');
      console.log('🔑 [VERIFY] Usando JWT_SECRET:', JWT_SECRET);
      console.log('🔑 [VERIFY] JWT_SECRET longitud:', JWT_SECRET.length);
    }
    const verified = jwt.verify(token, JWT_SECRET) as JWTPayload;
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ [VERIFY] Token verificado exitosamente');
      console.log('📋 [VERIFY] Payload:', JSON.stringify(verified, null, 2));
    }
    return verified;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('❌ [VERIFY] Error verificando token:', error);
      console.log('❌ [VERIFY] Tipo de error:', typeof error);
    }
    if (error instanceof Error) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ [VERIFY] Mensaje de error:', error.message);
      }
    }
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Buscar token en cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
    // Buscar en auth-token
    if (cookies['auth-token']) {
      return cookies['auth-token'];
    }
    // Buscar en _vercel_jwt
    if (cookies['_vercel_jwt']) {
      return cookies['_vercel_jwt'];
    }
  }

  // Buscar token en headers (fallback)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('auth-token', token, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 días
    path: '/',
    domain: undefined, // Usar el dominio actual
  });
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete('auth-token');
  return response;
}
