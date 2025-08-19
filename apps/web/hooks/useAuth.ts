import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
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
        setAuthState({
          user: data.user,
          isAuthenticated: data.isAuthenticated,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      // Después del registro exitoso, hacer login automáticamente
      const loginResult = await login(email, password);
      if (loginResult.success) {
        return { success: true, message: 'Usuario registrado y autenticado exitosamente' };
      } else {
        return { success: false, error: 'Registro exitoso pero error en login automático' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
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
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirigir basado en el rol del usuario
      const userRoles = data.user.roles || data.roles || [];
      console.log('Roles del usuario:', userRoles);
      if (userRoles.some((role: string) => role === 'Administrador' || role === 'Editor CMS')) {
        // Usuario admin/editor -> redirigir a /admin
        router.push('/admin');
      } else {
        // Usuario normal -> redirigir a la página principal
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

  const loginWithGoogle = async () => {
    // Por ahora, mostrar mensaje informativo
    alert('Login con Google estará disponible próximamente');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Limpiar estado local
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Redirigir a la página principal
      router.push('/');
    } catch (error) {
      console.error('Error en logout:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  return {
    session: { user: authState.user },
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    register,
    login,
    loginWithGoogle,
    logout,
    checkSession,
  };
}
