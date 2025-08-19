'use client';

import { useState } from 'react';
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Copy, 
  Settings,
  Move
} from 'lucide-react';

interface CMSCanvasProps {
  blocks: Block[];
  selectedBlock: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onBlockSelect: (blockId: string) => void;
  onAddBlock: (type: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, newContent: any) => void;
}

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
}

export function CMSCanvas({ 
  blocks, 
  selectedBlock, 
  viewMode,
  onBlockSelect, 
  onAddBlock, 
  onDeleteBlock, 
  onUpdateBlock 
}: CMSCanvasProps) {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  // Determinar el ancho del canvas según el modo de vista
  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-4xl';
    }
  };

  const duplicateBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      onAddBlock(block.type);
    }
  };

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlock === block.id;
    
    return (
      <div
        key={block.id}
        className={`relative group cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'
        }`}
        onClick={() => onBlockSelect(block.id)}
      >
        {/* Block controls */}
        <div className={`absolute -top-3 -left-3 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isSelected ? 'opacity-100' : ''
        }`}>
          <button className="p-1 text-gray-600 hover:text-gray-900 cursor-move">
            <Move className="w-3 h-3" />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
          >
            <Copy className="w-3 h-3" />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBlock(block.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Block content */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          {block.type === 'hero' && (
            <div className="text-center py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {block.content.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {block.content.subtitle}
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {block.content.buttonText}
              </button>
            </div>
          )}

          {block.type === 'text' && (
            <div className={`text-${block.content.alignment}`}>
              <p className={`text-${block.content.fontSize} text-gray-700`}>
                {block.content.text}
              </p>
            </div>
          )}

          {block.type === 'image' && (
            <div className="text-center">
              <img
                src={block.content.src}
                alt={block.content.alt}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">{block.content.caption}</p>
            </div>
          )}

          {block.type === 'services' && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {block.content.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {block.content.services?.map((service: any, index: number) => (
                  <div key={index} className="bg-blue-50 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-blue-700">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {block.type === 'testimonial' && (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <blockquote className="text-lg text-gray-700 mb-4">
                "{block.content.quote}"
              </blockquote>
              <div className="text-sm text-gray-600">
                <p className="font-semibold">{block.content.author}</p>
                <p>{block.content.position}, {block.content.company}</p>
              </div>
            </div>
          )}

          {block.type === 'code' && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">{block.content.code || '// Código de ejemplo\nfunction testQuality() {\n  return "¡Testing exitoso!";\n}'}</pre>
            </div>
          )}

          {/* Block type indicator */}
          <div className="absolute bottom-2 right-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {block.type}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Vista responsive indicator */}
      <div className="text-center py-2 bg-gray-100 border-b border-gray-200">
        <span className="text-xs text-gray-600">
          {viewMode === 'desktop' && '🖥️ Vista de Escritorio (1200px+)'}
          {viewMode === 'tablet' && '📱 Vista de Tablet (768px)'}
          {viewMode === 'mobile' && '📱 Vista Móvil (375px)'}
        </span>
      </div>
      
      <div className={`${getCanvasWidth()} mx-auto p-6 space-y-6 transition-all duration-300`}>
        {/* Add block button */}
        <div className="text-center">
          <button
            onClick={() => onAddBlock('text')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Bloque
          </button>
        </div>

        {/* Blocks */}
        {blocks.map(renderBlock)}

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay bloques aún
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza agregando tu primer bloque de contenido
            </p>
            <button
              onClick={() => onAddBlock('hero')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Agregar Hero Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
