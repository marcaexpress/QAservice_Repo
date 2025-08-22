'use client';

import { useState, useCallback } from 'react';
import { CMSidebar } from './CMSidebar';
import { CMSToolbar } from './CMSToolbar';
import { CMSCanvas } from './CMSCanvas';
import { CMSPanel } from './CMSPanel';
import { CMSAccessControl } from './CMSAccessControl';
import { CMSPageManager } from './CMSPageManager';
import CMSComponentManager from './CMSComponentManager';
import { CMSPage } from './types';
import { FileText } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
}

export function CMSLayout() {
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'layout' | 'access' | 'pages'>('content');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAccessControl, setShowAccessControl] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [showComponentManager, setShowComponentManager] = useState(false);
  const [currentPage, setCurrentPage] = useState<CMSPage | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const updateBlockContent = useCallback((blockId: string, newContent: any) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId 
          ? { ...block, content: newContent }
          : block
      )
    );
  }, []);

  const addBlock = useCallback((type: string) => {
    let newBlock: Block;
    
    if (type.startsWith('component_')) {
      // Es un componente - crear bloque de componente
      const componentId = type.replace('component_', '');
      newBlock = {
        id: `${type}-${Date.now()}`,
        type: 'component',
        content: {
          componentId,
          properties: {},
          instanceId: null
        },
        order: blocks.length + 1
      };
    } else {
      // Es un bloque básico
      newBlock = {
        id: `${type}-${Date.now()}`,
        type,
        content: getDefaultContent(type),
        order: blocks.length + 1
      };
    }
    
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
      case 'image':
        return {
          src: '/placeholder.jpg',
          alt: 'Descripción de la imagen',
          caption: 'Pie de foto opcional'
        };
      case 'video':
        return {
          src: 'https://example.com/video.mp4',
          poster: '/placeholder.jpg',
          autoplay: false,
          controls: true
        };
      case 'stats':
        return {
          title: 'Estadísticas',
          stats: [
            { label: 'Métrica 1', value: '100%' },
            { label: 'Métrica 2', value: '50+' }
          ]
        };
      case 'code':
        return {
          language: 'html',
          code: '<div>Tu código personalizado aquí</div>'
        };
      default:
        return {};
    }
  };

  const handleSave = useCallback(async () => {
    if (!currentPage) {
      alert('Debes seleccionar una página para guardar');
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${currentPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentPage.title,
          slug: currentPage.slug,
          description: currentPage.description,
          status: currentPage.status,
          blocks: blocks
        })
      });

      if (response.ok) {
        alert('Página guardada exitosamente');
      } else {
        alert('Error al guardar la página');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error al guardar la página');
    }
  }, [currentPage, blocks]);

  const handleTabChange = useCallback((tab: 'content' | 'theme' | 'layout' | 'access' | 'pages') => {
    setActiveTab(tab);
    
    // Reset all panels
    setShowAccessControl(false);
    setShowPageManager(false);
    setShowComponentManager(false);
    
    // Show appropriate panel
    if (tab === 'access') {
      setShowAccessControl(true);
    } else if (tab === 'pages') {
      setShowPageManager(true);
    }
  }, []);

  const handlePageSelect = useCallback((page: CMSPage) => {
    setCurrentPage(page);
    setBlocks(page.blocks as Block[] || []);
    setShowPageManager(false);
    setActiveTab('content');
  }, []);



  const selectedBlockData = selectedBlock ? blocks.find(b => b.id === selectedBlock) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar izquierda - Navegación y herramientas */}
      <CMSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
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
          currentPage={currentPage}
        />
        
        {/* Canvas principal y paneles laterales */}
        <div className="flex-1 flex">
          {/* Canvas principal */}
          <div className="flex-1 flex flex-col">
            {currentPage ? (
              <CMSCanvas 
                blocks={blocks}
                selectedBlock={selectedBlock}
                viewMode={viewMode}
                onBlockSelect={setSelectedBlock}
                onAddBlock={addBlock}
                onDeleteBlock={deleteBlock}
                onUpdateBlock={updateBlockContent}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Selecciona una página</h3>
                  <p className="text-sm">Ve a la pestaña "Páginas" para crear o seleccionar una página</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Panel derecho - Propiedades del bloque, Control de Acceso, Gestor de Páginas o Gestor de Componentes */}
          {showAccessControl && currentPage ? (
            <CMSAccessControl 
              pageId={currentPage.id}
              onClose={() => setShowAccessControl(false)}
            />
          ) : showPageManager ? (
            <CMSPageManager 
              onPageSelect={handlePageSelect}
              onClose={() => setShowPageManager(false)}
            />
          ) : showComponentManager ? (
            <CMSComponentManager />
          ) : selectedBlock && selectedBlockData ? (
            <CMSPanel 
              block={selectedBlockData}
              onClose={() => setSelectedBlock(null)}
              onUpdate={updateBlockContent}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
