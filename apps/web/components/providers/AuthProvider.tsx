'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; roles?: string[]; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(data.isAuthenticated);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // Actualizar estado local
      setUser(data.user);
      setIsAuthenticated(true);

      // Esperar un poco para que la cookie se establezca antes de redirigir
      console.log('⏳ Esperando a que la cookie se establezca...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirigir basado en el rol del usuario
      const userRoles = data.user.roles || data.roles || [];
      console.log('🔍 DEBUG - Roles del usuario:', userRoles);
      console.log('🔍 DEBUG - Usuario completo:', data.user);
      
      if (userRoles.some((role: string) => role === 'Administrador' || role === 'Editor CMS')) {
        // Usuario admin/editor -> redirigir a /admin
        console.log('🎯 DEBUG - Redirigiendo usuario admin/editor a /admin');
        router.push('/admin');
      } else {
        // Usuario normal -> redirigir a la página principal
        console.log('🏠 DEBUG - Redirigiendo usuario normal a /');
        router.push('/');
      }

      return { success: true, user: data.user, roles: userRoles };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Limpiar estado local
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirigir a la página principal
      router.push('/');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
