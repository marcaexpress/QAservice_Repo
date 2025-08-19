import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🧹 [ADMIN] Limpiando todas las cookies...');
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Todas las cookies han sido eliminadas' 
    });
    
    // Lista completa de cookies a eliminar
    const cookiesToClear = [
      'auth-token',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
      '__Secure-next-auth.callback-url',
      '__Host-next-auth.csrf-token',
    ];

    // Eliminar cada cookie con diferentes configuraciones para asegurar limpieza total
    cookiesToClear.forEach(cookieName => {
      // Configuración estándar
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        httpOnly: false,
      });
      
      // Con httpOnly
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true,
      });
      
      // Con secure
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
      });
    });
    
    console.log('✅ [ADMIN] Todas las cookies eliminadas');
    return response;
    
  } catch (error) {
    console.error('💥 [ADMIN] Error limpiando cookies:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
