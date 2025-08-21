'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  Globe, 
  FileText, 
  Calendar,
  User,
  Settings,
  Save,
  Send,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  Clock,
  Archive,
  AlertCircle
} from 'lucide-react';
import { CMSPage } from './types';

interface CMSPageManagerProps {
  onPageSelect: (page: CMSPage) => void;
  onClose: () => void;
}

export function CMSPageManager({ onPageSelect, onClose }: CMSPageManagerProps) {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [projectPages, setProjectPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'cms' | 'project'>('cms');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'DRAFT' as 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
  });

  useEffect(() => {
    loadPages();
    loadProjectPages();
  }, []);

  const loadPages = async () => {
    try {
      console.log('🔍 [CMSPageManager] Iniciando carga de páginas CMS...');
      setIsLoading(true);
      
      const response = await fetch('/api/cms/pages');
      console.log('📡 [CMSPageManager] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 [CMSPageManager] Data recibida:', data);
        
        if (data.success) {
          console.log('✅ [CMSPageManager] Páginas CMS cargadas:', data.pages?.length || 0);
          setPages(data.pages || []);
        } else {
          console.log('❌ [CMSPageManager] API no retornó success:', data);
        }
      } else {
        console.log('❌ [CMSPageManager] Response no OK:', response.status);
        const errorText = await response.text();
        console.log('❌ [CMSPageManager] Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ [CMSPageManager] Error loading CMS pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectPages = async () => {
    try {
      console.log('🔍 [CMSPageManager] Iniciando carga de páginas del proyecto...');
      
      const response = await fetch('/api/cms/pages/discover');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ [CMSPageManager] Páginas del proyecto cargadas:', data.pages?.length || 0);
          setProjectPages(data.pages || []);
        }
      }
    } catch (error) {
      console.error('❌ [CMSPageManager] Error loading project pages:', error);
    }
  };

  const handleImportPage = async (projectPage: any) => {
    try {
      const response = await fetch('/api/cms/pages/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: projectPage.slug,
          title: projectPage.title,
          description: projectPage.description,
          type: projectPage.type,
          path: projectPage.path
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`Página "${projectPage.title}" importada exitosamente al CMS`);
          await loadPages();
          await loadProjectPages();
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error importing page:', error);
      alert('Error al importar la página');
    }
  };

  const handleCreatePage = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      status: 'DRAFT'
    });
    setEditingPage(null);
    setShowCreateForm(true);
  };

  const handleEditPage = (page: CMSPage) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      status: page.status
    });
    setEditingPage(page);
    setShowCreateForm(true);
  };

  const handleSubmit = async () => {
    try {
      const url = editingPage 
        ? `/api/cms/pages/${editingPage.id}`
        : '/api/cms/pages';

      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShowCreateForm(false);
          await loadPages();
        }
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handlePublish = async (pageId: string) => {
    try {
      const response = await fetch(`/api/cms/pages/${pageId}/publish`, {
        method: 'POST'
      });

      if (response.ok) {
        await loadPages();
      }
    } catch (error) {
      console.error('Error publishing page:', error);
    }
  };

  const handleStatusChange = async (pageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cms/pages/${pageId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Show success message
          console.log(data.message);
          await loadPages();
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error changing page status:', error);
      alert('Error al cambiar el estado de la página');
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta página?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleSyncStatus = async () => {
    try {
      console.log('🔄 [CMSPageManager] Sincronizando estados de páginas...');
      
      const response = await fetch('/api/cms/pages/sync-status', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const message = `✅ Estados sincronizados exitosamente!\n\n📊 Estadísticas:\n- Total: ${data.stats.total}\n- Publicadas: ${data.stats.published}\n- En Revisión: ${data.stats.review}\n- Borradores: ${data.stats.draft}\n- Archivadas: ${data.stats.archived}\n\n🔄 Páginas actualizadas: ${data.updatedCount}`;
          alert(message);
          await loadPages(); // Recargar para mostrar estados corregidos
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Error en la sincronización: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during status sync:', error);
      alert('❌ Error durante la sincronización de estados');
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Borrador';
      case 'REVIEW': return 'En Revisión';
      case 'PUBLISHED': return 'Publicado';
      case 'ARCHIVED': return 'Archivado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="w-3 h-3" />;
      case 'REVIEW': return <Clock className="w-3 h-3" />;
      case 'PUBLISHED': return <CheckCircle className="w-3 h-3" />;
      case 'ARCHIVED': return <Archive className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando páginas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Gestor de Páginas</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Gestiona todas las páginas del sitio
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar páginas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="DRAFT">Borradores</option>
          <option value="REVIEW">En Revisión</option>
          <option value="PUBLISHED">Publicados</option>
          <option value="ARCHIVED">Archivados</option>
        </select>
      </div>

      {/* Create Page Button */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <button
          onClick={handleCreatePage}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Página</span>
        </button>
        
        {/* Debug Button */}
        <button
          onClick={loadPages}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          🔄 Recargar Páginas (Debug)
        </button>

        {/* Sync Status Button */}
        <button
          onClick={handleSyncStatus}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          🎯 Sincronizar Estados
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay páginas encontradas</p>
            <p className="text-sm">Crea tu primera página para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPages.map((page) => (
              <div key={page.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{page.title}</h4>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onPageSelect(page)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar página"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handlePublish(page.id)}
                      disabled={page.status === 'PUBLISHED'}
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                      title="Publicar página"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar página"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  {/* Estado actual con opción de cambio */}
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(page.status)} flex items-center space-x-1`}>
                      {getStatusIcon(page.status)}
                      <span>{getStatusLabel(page.status)}</span>
                    </span>
                    
                    {/* Indicador de sincronización */}
                    {page.status === 'PUBLISHED' && (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs flex items-center space-x-1">
                        🌐 Web Pública
                      </span>
                    )}
                    
                    {/* Dropdown para cambiar estado */}
                    <div className="relative group">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-32">
                        <div className="py-1">
                          {['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(page.id, status)}
                              disabled={status === page.status}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                                status === page.status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(status)}
                                <span>{getStatusLabel(status)}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                    </span>
                    {page.published && (
                      <span className="flex items-center space-x-1 text-green-600">
                        <Globe className="w-3 h-3" />
                        <span>Pública</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Page Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingPage ? 'Editar Página' : 'Nueva Página'}
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="mi-pagina"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DRAFT">Borrador</option>
                  <option value="REVIEW">En Revisión</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Archivado</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPage ? 'Actualizar' : 'Crear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
