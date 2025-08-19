'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // No mostrar header/footer en páginas admin
  const isAdminRoute = pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // Solo contenido para rutas admin
    return <>{children}</>;
  }
  
  // Layout completo para rutas públicas con AuthProvider
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
