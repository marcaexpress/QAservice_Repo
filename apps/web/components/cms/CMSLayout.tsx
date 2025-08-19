'use client';

import { useState, useCallback } from 'react';
import { CMSidebar } from './CMSidebar';
import { CMSToolbar } from './CMSToolbar';
import { CMSCanvas } from './CMSCanvas';
import { CMSPanel } from './CMSPanel';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
}

export function CMSLayout() {
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'layout'>('content');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'hero-1',
      type: 'hero',
      content: {
        title: 'Bienvenido a QA Services',
        subtitle: 'Servicios profesionales de testing y calidad de software',
        buttonText: 'Conoce nuestros servicios',
        buttonLink: '/servicios',
        image: '/hero-qa.jpg'
      },
      order: 1
    },
    {
      id: 'text-1',
      type: 'text',
      content: {
        text: 'Somos expertos en garantizar la calidad de tu software. Ofrecemos servicios integrales de testing, automatización y consultoría especializada en QA.',
        alignment: 'center',
        fontSize: 'lg'
      },
      order: 2
    },
    {
      id: 'services-1',
      type: 'services',
      content: {
        title: 'Nuestros Servicios',
        services: [
          { name: 'Testing Manual', description: 'Pruebas exhaustivas manuales' },
          { name: 'Testing Automatizado', description: 'Automatización de pruebas' },
          { name: 'Consultoría QA', description: 'Asesoría especializada' }
        ]
      },
      order: 3
    }
  ]);

  const updateBlockContent = useCallback((blockId: string, newContent: any) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId 
          ? { ...block, content: { ...block.content, ...newContent } }
          : block
      )
    );
  }, []);

  const addBlock = useCallback((type: string) => {
    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: blocks.length + 1
    };
    setBlocks(prev => [...prev, newBlock]);
  }, [blocks.length]);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Nuevo Hero Section',
          subtitle: 'Descripción del hero',
          buttonText: 'Acción',
          buttonLink: '/',
          image: '/placeholder.jpg'
        };
      case 'text':
        return {
          text: 'Nuevo bloque de texto. Haz clic para editar.',
          alignment: 'left',
          fontSize: 'base'
        };
      case 'services':
        return {
          title: 'Servicios',
          services: [
            { name: 'Servicio 1', description: 'Descripción del servicio' }
          ]
        };
      case 'testimonial':
        return {
          quote: 'Testimonio del cliente',
          author: 'Nombre del cliente',
          position: 'Cargo',
          company: 'Empresa'
        };
      default:
        return {};
    }
  };

  const handleSave = useCallback(() => {
    // Aquí implementaremos la lógica de guardado
    console.log('Guardando contenido...', blocks);
    // TODO: Enviar a API para persistir
  }, [blocks]);

  const selectedBlockData = selectedBlock ? blocks.find(b => b.id === selectedBlock) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar izquierda - Herramientas y bloques */}
      <CMSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onBlockSelect={setSelectedBlock}
        onAddBlock={addBlock}
      />
      
      {/* Área principal de trabajo */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar superior */}
        <CMSToolbar 
          activeTab={activeTab}
          viewMode={viewMode}
          onSave={handleSave}
          onPreview={() => console.log('Vista previa...', blocks)}
          onPublish={() => console.log('Publicando...', blocks)}
          onViewModeChange={setViewMode}
        />
        
        {/* Canvas principal */}
        <div className="flex-1 flex">
          <CMSCanvas 
            blocks={blocks}
            selectedBlock={selectedBlock}
            viewMode={viewMode}
            onBlockSelect={setSelectedBlock}
            onAddBlock={addBlock}
            onDeleteBlock={deleteBlock}
            onUpdateBlock={updateBlockContent}
          />
          
          {/* Panel derecho - Propiedades del bloque */}
          {selectedBlock && selectedBlockData && (
            <CMSPanel 
              block={selectedBlockData}
              onClose={() => setSelectedBlock(null)}
              onUpdate={updateBlockContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
