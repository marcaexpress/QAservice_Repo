'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 [ADMIN-PAGE] Verificando autenticación...');
      
      // Limpiar cookies NextAuth si existen
      document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      const response = await fetch('/api/admin/session');
      if (response.ok) {
        const data = await response.json();
        console.log('📋 [ADMIN-PAGE] Respuesta:', data);
        
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
          setIsLoading(false);
          console.log('✅ [ADMIN-PAGE] Usuario admin autenticado');
          return;
        }
      }
      
      console.log('❌ [ADMIN-PAGE] No autenticado, redirigiendo...');
      router.replace('/admin/login');
    } catch (error) {
      console.error('💥 [ADMIN-PAGE] Error:', error);
      router.replace('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🔐 [ADMIN-PAGE] Cerrando sesión...');
      await fetch('/api/admin/logout', { method: 'POST' });
      
      // Limpiar cookies localmente también
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      router.push('/admin/login');
    } catch (error) {
      console.error('💥 [ADMIN-PAGE] Error cerrando sesión:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Se está redirigiendo
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Admin */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo />
              <div className="ml-6">
                <h1 className="text-xl font-semibold text-gray-900">
                  🎨 Panel de Administración CMS
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                👤 {user.name} ({user.roles.join(', ')})
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
              >
                🔐 Cerrar Sesión
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
              >
                🌐 Ver Sitio Público
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Bienvenida */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎨 Panel de Administración CMS
            </h1>
            <p className="text-lg text-gray-600">
              Bienvenido al sistema de gestión de contenidos de QA Services
            </p>
          </div>

          {/* Cards de herramientas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/cms" className="group">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Editor Visual CMS</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Edita el contenido del sitio web usando el editor visual drag & drop
                </p>
                <div className="text-blue-600 group-hover:text-blue-800 font-medium">
                  Abrir Editor →
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Analytics</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Próximamente: Estadísticas de visitantes y engagement
              </p>
              <div className="text-gray-400 font-medium">
                En desarrollo...
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-lg p-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Usuarios</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Próximamente: Gestión de usuarios y permisos
              </p>
              <div className="text-gray-400 font-medium">
                En desarrollo...
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Estado del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">✓</div>
                <div className="text-sm text-blue-800 font-medium">CMS Activo</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm text-green-800 font-medium">Base de Datos</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">✓</div>
                <div className="text-sm text-purple-800 font-medium">Autenticación</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">🚀</div>
                <div className="text-sm text-orange-800 font-medium">Todo Funcionando</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
