'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuthContext } from '@/components/providers/AuthProvider';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthContext();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Aprendizaje', href: '/aprendizaje' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await logout();
  };

  // Verificar si el usuario tiene permisos de administración
  const hasAdminAccess = user?.roles?.some((role: string) => 
    role === 'Administrador' || role === 'Editor CMS'
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-primary-600">QA Services</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {hasAdminAccess && (
                  <Link href="/admin">
                    <Button variant="primary" size="sm">
                      🎛️ Administración
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Hola, {user?.name || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/registro">
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <>
                  {hasAdminAccess && (
                    <Link href="/admin" className="block">
                      <Button variant="primary" size="sm" className="w-full">
                        🎛️ Administración
                      </Button>
                    </Link>
                  )}
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Hola, {user?.name || user?.email}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/registro" className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
