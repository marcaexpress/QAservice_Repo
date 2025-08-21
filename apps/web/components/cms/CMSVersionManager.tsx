'use client';

import { useState, useEffect } from 'react';
import { History, RotateCcw, Trash2, Eye, Calendar, User } from 'lucide-react';

interface Version {
  id: string;
  version: number;
  title: string;
  description?: string;
  blocks: any[];
  metadata?: any;
  createdAt: Date;
  creator?: {
    name: string;
    email: string;
  };
  changeNotes?: string;
  author?: string;
  timestamp?: string;
}

interface CMSVersionManagerProps {
  pageId: string;
  onVersionRestored?: () => void;
}

export function CMSVersionManager({ pageId, onVersionRestored }: CMSVersionManagerProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [actionMessage, setActionMessage] = useState<string>('');

  useEffect(() => {
    if (pageId) {
      loadVersions();
    }
  }, [pageId]);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cms/pages/${pageId}/versions`);
      const result = await response.json();

      if (result.success) {
        setVersions(result.versions);
      } else {
        console.error('Error loading versions:', result.error);
      }
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreVersion = async (version: Version) => {
    try {
      setActionMessage('Restaurando versión...');
      const response = await fetch(`/api/cms/pages/${pageId}/versions/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionNumber: version.version })
      });

      const result = await response.json();

      if (result.success) {
        setActionMessage(`✅ ${result.message}`);
        setShowConfirmRestore(false);
        setSelectedVersion(null);
        
        // Reload versions and notify parent
        await loadVersions();
        if (onVersionRestored) {
          onVersionRestored();
        }
        
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        setActionMessage(`❌ ${result.error}`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error restoring version:', error);
      setActionMessage('❌ Error al restaurar la versión');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleDeleteVersion = async (version: Version) => {
    try {
      setActionMessage('Eliminando versión...');
      const response = await fetch(`/api/cms/pages/${pageId}/versions/${version.version}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setActionMessage(`✅ ${result.message}`);
        setShowConfirmDelete(false);
        setSelectedVersion(null);
        
        // Reload versions
        await loadVersions();
        
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        setActionMessage(`❌ ${result.error}`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting version:', error);
      setActionMessage('❌ Error al eliminar la versión');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatChangeNotes = (notes: string) => {
    if (!notes || notes === 'Sin notas de cambios') {
      return 'Sin notas de cambios';
    }
    return notes.length > 100 ? `${notes.substring(0, 100)}...` : notes;
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando versiones...</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No hay versiones disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <History className="w-5 h-5 mr-2" />
          Historial de Versiones
        </h3>
        <span className="text-sm text-gray-500">
          {versions.length} versión{versions.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {actionMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          actionMessage.startsWith('✅') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {actionMessage}
        </div>
      )}

      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedVersion?.id === version.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedVersion(version)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  v{version.version}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{version.title}</h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(version.timestamp || version.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {version.author || version.creator?.name || 'Usuario'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVersion(version);
                    setShowConfirmRestore(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Restaurar versión"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {versions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVersion(version);
                      setShowConfirmDelete(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Eliminar versión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {version.changeNotes && (
              <div className="mt-3 text-sm text-gray-600">
                <strong>Notas de cambios:</strong> {formatChangeNotes(version.changeNotes)}
              </div>
            )}

            {selectedVersion?.id === version.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Bloques:</strong> {version.blocks?.length || 0}
                  </div>
                  <div>
                    <strong>Estado:</strong> 
                    <span className="ml-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {version.version === versions[0]?.version ? 'Actual' : 'Anterior'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Restore Modal */}
      {showConfirmRestore && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Restauración
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres restaurar la versión {selectedVersion.version}? 
              Esta acción sobrescribirá la versión actual.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmRestore(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRestoreVersion(selectedVersion)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar la versión {selectedVersion.version}? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteVersion(selectedVersion)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
