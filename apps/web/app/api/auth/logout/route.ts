import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/jwt';

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logout exitoso'
    });

    // Limpiar cookie de autenticación
    return clearAuthCookie(response);
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
