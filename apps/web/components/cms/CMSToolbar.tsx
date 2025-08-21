'use client';

import { useState } from 'react';
import { 
  Save, 
  Eye, 
  Send, 
  Undo, 
  Redo, 
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  FileText
} from 'lucide-react';
import { CMSPage } from './types';

interface CMSToolbarProps {
  activeTab: 'content' | 'theme' | 'layout' | 'access' | 'pages';
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  currentPage: CMSPage | null;
}

export function CMSToolbar({ 
  activeTab, 
  viewMode,
  onSave, 
  onPreview, 
  onPublish,
  onViewModeChange,
  currentPage
}: CMSToolbarProps) {

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

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Page info */}
        <div className="flex items-center space-x-4">
          <div>
            {currentPage ? (
              <>
                <h1 className="text-lg font-semibold text-gray-900">{currentPage.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>/{currentPage.slug}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(currentPage.status)}`}>
                    {getStatusLabel(currentPage.status)}
                  </span>
                  {currentPage.published && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">Pública</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-lg font-semibold text-gray-900">Sin página seleccionada</h1>
                <p className="text-sm text-gray-600">Selecciona una página para comenzar a editar</p>
              </>
            )}
          </div>
          
          {/* View mode selector - Solo mostrar cuando hay página seleccionada */}
          {currentPage && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'desktop' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vista de escritorio (1200px+)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('tablet')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tablet' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vista de tablet (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'mobile' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vista móvil (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Undo/Redo - Solo mostrar cuando hay página seleccionada */}
          {currentPage && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-colors">
                <Undo className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-colors">
                <Redo className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>

          {/* Save - Solo mostrar cuando hay página seleccionada */}
          {currentPage && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          )}

          {/* Preview - Solo mostrar cuando hay página seleccionada */}
          {currentPage && (
            <button
              onClick={onPreview}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Vista Previa</span>
            </button>
          )}

          {/* Publish - Solo mostrar cuando hay página seleccionada y no está publicada */}
          {currentPage && currentPage.status !== 'PUBLISHED' && (
            <button
              onClick={onPublish}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Publicar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
