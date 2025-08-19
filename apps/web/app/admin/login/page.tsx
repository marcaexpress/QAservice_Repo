'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('🔐 [ADMIN-LOGIN] Iniciando proceso de login...');
      
      // Limpiar cualquier cookie NextAuth antes del login
      document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // Verificar que el usuario tiene permisos de admin
      const userRoles = data.user?.roles || data.roles || [];
      const hasAdminAccess = userRoles.some((role: string) => 
        role === 'Administrador' || role === 'Editor CMS'
      );

      if (!hasAdminAccess) {
        throw new Error('No tienes permisos para acceder al panel de administración. Solo usuarios con rol de Administrador o Editor CMS pueden acceder.');
      }

      // Login exitoso - redirección directa y simple
      console.log('✅ Login admin exitoso, redirigiendo...');
      window.location.href = '/admin';
      
    } catch (error) {
      console.error('❌ Error en login admin:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
            <Logo />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🔐 Acceso Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Panel de administración - Solo para administradores y editores CMS
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico de Administrador
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="admin@qaservices.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    🔓 Acceder al Panel Admin
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Volver al sitio público
            </a>
          </div>

          {/* Credenciales de prueba */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">🧪 Credenciales de Prueba:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <div><strong>Admin:</strong> admin@qaservices.com | <strong>Pass:</strong> admin123</div>
              <div><strong>Editor:</strong> editor@qaservices.com | <strong>Pass:</strong> editor123</div>
              <div className="text-blue-600 mt-1">💡 Usa las credenciales de arriba para hacer login</div>
            </div>
            
            {/* Botón de prueba rápida */}
            <div className="mt-3 pt-3 border-t border-blue-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    email: 'admin@qaservices.com',
                    password: 'admin123'
                  });
                }}
                className="text-xs text-blue-700 hover:text-blue-900 underline"
              >
                🔧 Rellenar con credenciales de admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
