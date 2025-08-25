// 🟩 Forzar entorno Node.js para evitar Edge Runtime
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateToken, setAuthCookie } from '@/lib/jwt';

// Esquema de validación para el login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log(`[LOGIN] Intento de login: email=${request?.body?.email || 'N/A'} ip=${request.headers.get('x-forwarded-for') || request.headers.get('host')}`);
    }
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Buscar usuario con password usando raw query para evitar problemas de tipos
    const user = await prisma.$queryRaw`
      SELECT u.id, u.email, u.name, u.password, u."organizationId"
      FROM users u 
      WHERE u.email = ${email}
    ` as any[];

    if (!user || user.length === 0) {
      if (process.env.NODE_ENV === 'production') {
        console.log(`[LOGIN] Fallo: usuario no encontrado para email=${email}`);
      }
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const userData = user[0];

    // Verificar contraseña
    if (!userData.password) {
      if (process.env.NODE_ENV === 'production') {
        console.log(`[LOGIN] Fallo: usuario sin contraseña configurada email=${email}`);
      }
      return NextResponse.json(
        { error: 'Este usuario no tiene contraseña configurada' },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, userData.password);
    if (!isPasswordValid) {
      if (process.env.NODE_ENV === 'production') {
        console.log(`[LOGIN] Fallo: contraseña inválida para email=${email}`);
      }
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Buscar roles del usuario
    if (process.env.NODE_ENV === 'production') {
      console.log(`[LOGIN] Éxito: usuario autenticado email=${email} id=${userData.id}`);
    }
    const roles = await prisma.$queryRaw`
      SELECT r.name, r.description
      FROM roles r
      INNER JOIN role_assignments ra ON r.id = ra."roleId"
      WHERE ra."userId" = ${userData.id}
    ` as any[];

    // Generar JWT token
    const tokenPayload = {
      userId: userData.id,
      email: userData.email,
      name: userData.name || '',
      roles: roles.map((r: any) => r.name),
      organizationId: userData.organizationId || undefined,
    };

    const token = generateToken(tokenPayload);
    console.log('🔑 [LOGIN] Token JWT generado:', token.substring(0, 50) + '...');

    // Crear respuesta exitosa
    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        roles: roles.map((r: any) => r.name),
        organizationId: userData.organizationId,
      },
      roles: roles.map((r: any) => r.name)
    });

    // Establecer cookie de autenticación
    console.log('🍪 [LOGIN] Estableciendo cookie auth-token...');
    const responseWithCookie = setAuthCookie(response, token);
    console.log('✅ [LOGIN] Cookie establecida, respuesta preparada');
    
    return responseWithCookie;

  } catch (error) {
    console.error('Error en login:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
