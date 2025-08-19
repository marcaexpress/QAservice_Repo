import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔐 [ADMIN] Cerrando sesión admin...');
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Sesión admin cerrada exitosamente' 
    });
    
    // Eliminar cookie auth-token
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Expirar inmediatamente
    });

    // Limpiar cualquier cookie NextAuth residual
    response.cookies.set('next-auth.session-token', '', {
      path: '/',
      expires: new Date(0),
    });
    
    response.cookies.set('next-auth.csrf-token', '', {
      path: '/',
      expires: new Date(0),
    });
    
    response.cookies.set('next-auth.callback-url', '', {
      path: '/',
      expires: new Date(0),
    });
    
    console.log('✅ [ADMIN] Cookies admin eliminadas');
    return response;
    
  } catch (error) {
    console.error('💥 [ADMIN] Error cerrando sesión:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
