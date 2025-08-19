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
  Monitor
} from 'lucide-react';

interface CMSToolbarProps {
  activeTab: 'content' | 'theme' | 'layout';
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export function CMSToolbar({ 
  activeTab, 
  viewMode,
  onSave, 
  onPreview, 
  onPublish,
  onViewModeChange 
}: CMSToolbarProps) {

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Page info */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Página Principal</h1>
            <p className="text-sm text-gray-600">Última edición: hace 2 minutos</p>
          </div>
          
          {/* View mode selector */}
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
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Undo/Redo */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-colors">
              <Undo className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-colors">
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>

          {/* Save */}
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>

          {/* Preview */}
          <button
            onClick={onPreview}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </button>

          {/* Publish */}
          <button
            onClick={onPublish}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Publicar
          </button>
        </div>
      </div>

      {/* Active tab indicator */}
      <div className="mt-3">
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-900">
            Modo: {activeTab === 'content' ? 'Contenido' : activeTab === 'theme' ? 'Tema' : 'Layout'}
          </span>
          <span className="text-sm text-gray-600">
            Vista: {viewMode === 'desktop' ? 'Escritorio' : viewMode === 'tablet' ? 'Tablet' : 'Móvil'}
          </span>
        </div>
      </div>
    </div>
  );
}
