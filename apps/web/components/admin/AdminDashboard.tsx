'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = user.roles.some((ra: any) => ra.role.name === 'Administrador');
  const isEditor = user.roles.some((ra: any) => ra.role.name === 'Editor CMS');

  const tabs = [
    { id: 'overview', name: 'Vista General', icon: '📊' },
    { id: 'content', name: 'Contenido', icon: '📝', requiresEditor: true },
    { id: 'theme', name: 'Temas', icon: '🎨', requiresEditor: true },
    { id: 'layout', name: 'Layouts', icon: '🏗️', requiresEditor: true },
    { id: 'users', name: 'Usuarios', icon: '👥', requiresAdmin: true },
    { id: 'settings', name: 'Configuración', icon: '⚙️', requiresAdmin: true },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-primary-600">
                QA Services
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-lg font-medium text-gray-900">Administración</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {user.name || user.email}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {isAdmin ? 'Administrador' : 'Editor CMS'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de navegación */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const canAccess = (tab.requiresAdmin && isAdmin) || 
                               (tab.requiresEditor && (isAdmin || isEditor)) || 
                               (!tab.requiresAdmin && !tab.requiresEditor);
              
              if (!canAccess) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido de las tabs */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Vista General</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-blue-600 text-2xl font-bold">12</div>
                  <div className="text-blue-800 font-medium">Páginas</div>
                  <div className="text-blue-600 text-sm">Total del sitio</div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-green-600 text-2xl font-bold">8</div>
                  <div className="text-green-800 font-medium">Bloques</div>
                  <div className="text-green-600 text-sm">Componentes activos</div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-purple-600 text-2xl font-bold">3</div>
                  <div className="text-purple-800 font-medium">Temas</div>
                  <div className="text-purple-600 text-sm">Disponibles</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="primary" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('content')}
                  >
                    📝 Crear Nueva Página
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('theme')}
                  >
                    🎨 Personalizar Tema
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Contenido</h2>
              <p className="text-gray-600">Aquí podrás crear y editar páginas, bloques y contenido del sitio.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  🚧 Esta funcionalidad estará disponible en la Fase 4: CMS Visual Básico
                </p>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Personalización de Temas</h2>
              <p className="text-gray-600">Personaliza colores, tipografías y estilos del sitio.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  🚧 Esta funcionalidad estará disponible en la Fase 4: CMS Visual Básico
                </p>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Layouts</h2>
              <p className="text-gray-600">Organiza la estructura y disposición de las páginas.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  🚧 Esta funcionalidad estará disponible en la Fase 4: CMS Visual Básico
                </p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <p className="text-gray-600">Administra usuarios, roles y permisos del sistema.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  🚧 Esta funcionalidad estará disponible en la Fase 4: CMS Visual Básico
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
              <p className="text-gray-600">Configuración general y preferencias del sitio.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  🚧 Esta funcionalidad estará disponible en la Fase 4: CMS Visual Básico
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
