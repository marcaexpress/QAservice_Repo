'use client';

import { useState } from 'react';
import { 
  FileText, 
  Palette, 
  Layout, 
  Plus, 
  Image, 
  Type, 
  Video,
  Code,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface CMSidebarProps {
  activeTab: 'content' | 'theme' | 'layout';
  onTabChange: (tab: 'content' | 'theme' | 'layout') => void;
  onBlockSelect: (blockId: string) => void;
  onAddBlock: (type: string) => void;
}

const contentBlocks = [
  { id: 'hero', name: 'Hero Section', icon: Image, category: 'Sections' },
  { id: 'text', name: 'Text Block', icon: Type, category: 'Content' },
  { id: 'services', name: 'Services Grid', icon: BarChart3, category: 'QA Services' },
  { id: 'testimonial', name: 'Testimonial', icon: MessageSquare, category: 'Content' },
  { id: 'image', name: 'Image', icon: Image, category: 'Media' },
  { id: 'video', name: 'Video', icon: Video, category: 'Media' },
  { id: 'code', name: 'Code Block', icon: Code, category: 'QA Testing' },
  { id: 'chart', name: 'Metrics Chart', icon: BarChart3, category: 'QA Analytics' },
];

const themeOptions = [
  { id: 'colors', name: 'Colores', icon: Palette, category: 'Tema' },
  { id: 'typography', name: 'Tipografía', icon: Type, category: 'Tema' },
  { id: 'spacing', name: 'Espaciado', icon: Layout, category: 'Tema' },
];

const layoutOptions = [
  { id: 'container', name: 'Contenedor', icon: Layout, category: 'Layout' },
  { id: 'grid', name: 'Grid', icon: Layout, category: 'Layout' },
  { id: 'flexbox', name: 'Flexbox', icon: Layout, category: 'Layout' },
];

export function CMSidebar({ activeTab, onTabChange, onBlockSelect, onAddBlock }: CMSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderBlocks = (blocks: typeof contentBlocks) => {
    const filteredBlocks = blocks.filter(block =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-2">
        {filteredBlocks.map((block) => (
          <div
            key={block.id}
            className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
            onClick={() => onAddBlock(block.id)}
          >
            <block.icon className="w-5 h-5 text-gray-600 mr-3" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{block.name}</div>
              <div className="text-xs text-gray-500">{block.category}</div>
            </div>
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">CMS Editor</h2>
        <p className="text-sm text-gray-600">Construye tu página</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('content')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Contenido
        </button>
        <button
          onClick={() => onTabChange('theme')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'theme'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Tema
        </button>
        <button
          onClick={() => onTabChange('layout')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'layout'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layout className="w-4 h-4 inline mr-2" />
          Layout
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar bloques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Bloques de Contenido</h3>
              <button 
                onClick={() => onAddBlock('text')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Agregar bloque de texto rápido"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {renderBlocks(contentBlocks)}
          </div>
        )}

        {activeTab === 'theme' && (
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Opciones de Tema</h3>
            {renderBlocks(themeOptions)}
          </div>
        )}

        {activeTab === 'layout' && (
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Opciones de Layout</h3>
            {renderBlocks(layoutOptions)}
          </div>
        )}
      </div>
    </div>
  );
}
