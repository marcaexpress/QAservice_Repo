'use client';

import { useState, useEffect } from 'react';
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
  MessageSquare,
  Shield,
  FolderOpen,
  Settings,
  Layers,
  Grid3X3,
  Sparkles,
  Eye,
  Zap,
  Search
} from 'lucide-react';

interface CMSidebarProps {
  activeTab: 'content' | 'theme' | 'layout' | 'access' | 'pages';
  onTabChange: (tab: 'content' | 'theme' | 'layout' | 'access' | 'pages') => void;
  onBlockSelect: (blockId: string) => void;
  onAddBlock: (type: string) => void;
}

// Bloques de contenido organizados por categorías
const contentBlocks = [
  {
    id: 'hero',
    name: 'Hero Section',
    category: 'Secciones Principales',
    icon: Eye,
    description: 'Sección principal de la página',
    type: 'basic'
  },
  {
    id: 'text',
    name: 'Bloque de Texto',
    category: 'Contenido',
    icon: Type,
    description: 'Texto con formato personalizable',
    type: 'basic'
  },
  {
    id: 'image',
    name: 'Imagen',
    category: 'Medios',
    icon: Image,
    description: 'Imagen con opciones de diseño',
    type: 'basic'
  },
  {
    id: 'video',
    name: 'Video',
    category: 'Medios',
    icon: Video,
    description: 'Reproductor de video integrado',
    type: 'basic'
  },
  {
    id: 'services',
    name: 'Servicios',
    category: 'Secciones Principales',
    icon: Zap,
    description: 'Lista de servicios con iconos',
    type: 'basic'
  },
  {
    id: 'testimonial',
    name: 'Testimonio',
    category: 'Social',
    icon: MessageSquare,
    description: 'Testimonios de clientes',
    type: 'basic'
  },
  {
    id: 'stats',
    name: 'Estadísticas',
    category: 'Datos',
    icon: BarChart3,
    description: 'Números y métricas destacadas',
    type: 'basic'
  },
  {
    id: 'code',
    name: 'Código Personalizado',
    category: 'Avanzado',
    icon: Code,
    description: 'HTML/CSS personalizado',
    type: 'basic'
  }
];

// Opciones de tema
const themeOptions = [
  {
    id: 'colors',
    name: 'Paleta de Colores',
    category: 'Apariencia',
    icon: Palette,
    description: 'Colores principales y secundarios',
    type: 'theme'
  },
  {
    id: 'typography',
    name: 'Tipografía',
    category: 'Texto',
    icon: Type,
    description: 'Fuentes y estilos de texto',
    type: 'theme'
  },
  {
    id: 'spacing',
    name: 'Espaciado',
    category: 'Layout',
    icon: Grid3X3,
    description: 'Márgenes y padding',
    type: 'theme'
  },
  {
    id: 'shadows',
    name: 'Sombras',
    category: 'Efectos',
    icon: Sparkles,
    description: 'Sombras y profundidad',
    type: 'theme'
  }
];

// Opciones de layout
const layoutOptions = [
  {
    id: 'container',
    name: 'Contenedor',
    category: 'Estructura',
    icon: Layers,
    description: 'Ancho y centrado del contenido',
    type: 'layout'
  },
  {
    id: 'grid',
    name: 'Sistema de Grid',
    category: 'Estructura',
    icon: Grid3X3,
    description: 'Columnas y filas',
    type: 'layout'
  },
  {
    id: 'responsive',
    name: 'Responsive',
    category: 'Adaptación',
    icon: Eye,
    description: 'Comportamiento en móvil',
    type: 'layout'
  }
];

export function CMSidebar({ activeTab, onTabChange, onBlockSelect, onAddBlock }: CMSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Secciones Principales']);
  const [components, setComponents] = useState<any[]>([]);
  const [componentsLoading, setComponentsLoading] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Cargar componentes cuando se active la pestaña de contenido
  useEffect(() => {
    if (activeTab === 'content' && components.length === 0) {
      loadComponents();
    }
  }, [activeTab, components.length]);

  const loadComponents = async () => {
    setComponentsLoading(true);
    try {
      const response = await fetch('/api/cms/components');
      if (response.ok) {
        const data = await response.json();
        // Convertir componentes a bloques
        const componentBlocks = data.components.map((comp: any) => ({
          id: `component_${comp.id}`,
          name: comp.name,
          category: `Componentes ${comp.type}`,
          icon: getComponentIcon(comp.type),
          description: comp.description || `Componente ${comp.type}`,
          type: 'component',
          componentData: comp
        }));
        setComponents(componentBlocks);
      }
    } catch (error) {
      console.error('Error loading components:', error);
    }
    setComponentsLoading(false);
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'layout': return Layers;
      case 'block': return Grid3X3;
      case 'ui': return Palette;
      case 'form': return Type;
      default: return Layers;
    }
  };

  const renderBlocks = (blocks: typeof contentBlocks) => {
    // Combinar bloques básicos con componentes
    const allBlocks = [...blocks, ...components];
    
    const filteredBlocks = allBlocks.filter(block =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agrupar por categoría
    const groupedBlocks = filteredBlocks.reduce((acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    }, {} as Record<string, typeof allBlocks>);

    return (
      <div className="space-y-4">
        {Object.entries(groupedBlocks).map(([category, categoryBlocks]) => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{category}</span>
              <span className={`transform transition-transform ${expandedCategories.includes(category) ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedCategories.includes(category) && (
              <div className="ml-4 space-y-2">
                {(categoryBlocks as any[]).map((block) => (
                  <div
                    key={block.id}
                    className="group relative p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => onAddBlock(block.id)}
                  >
                                         <div className="flex items-start space-x-3">
                       <div className={`flex-shrink-0 p-2 rounded-lg group-hover:bg-blue-100 transition-colors ${
                         block.type === 'component' 
                           ? 'bg-purple-50 group-hover:bg-purple-100' 
                           : 'bg-blue-50 group-hover:bg-blue-100'
                       }`}>
                         <block.icon className={`w-4 h-4 ${
                           block.type === 'component' ? 'text-purple-600' : 'text-blue-600'
                         }`} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center space-x-2">
                           <span className="font-medium text-gray-900 text-sm">{block.name}</span>
                           {block.type === 'component' && (
                             <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                               Componente
                             </span>
                           )}
                         </div>
                         <div className="text-xs text-gray-500 mt-1">{block.description}</div>
                       </div>
                       <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pages':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-blue-100" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Páginas</h3>
              <p className="text-sm text-gray-600">Crea, edita y gestiona todas las páginas del sitio</p>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <div className="sticky top-0 bg-white pb-4 z-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar bloques..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            {componentsLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">Cargando componentes...</p>
              </div>
            )}
            {renderBlocks(contentBlocks)}
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-4">
            <div className="text-center py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Personalización de Tema</h3>
              <p className="text-sm text-gray-600">Personaliza colores, tipografía y efectos</p>
            </div>
            {renderBlocks(themeOptions)}
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-4">
            <div className="text-center py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Opciones de Layout</h3>
              <p className="text-sm text-gray-600">Configura la estructura y disposición</p>
            </div>
            {renderBlocks(layoutOptions)}
          </div>
        );

      case 'access':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Shield className="w-16 h-16 mx-auto mb-4 text-green-100" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Control de Acceso</h3>
              <p className="text-sm text-gray-600">Gestiona permisos y reglas de acceso</p>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">CMS Editor</h2>
            <p className="text-sm text-gray-600">Construye tu página</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <nav className="flex flex-col">
          {[
            { id: 'pages', label: 'Páginas', icon: FolderOpen, color: 'blue' },
            { id: 'content', label: 'Contenido', icon: FileText, color: 'green' },
            { id: 'theme', label: 'Tema', icon: Palette, color: 'purple' },
            { id: 'layout', label: 'Layout', icon: Layout, color: 'orange' },
            { id: 'access', label: 'Acceso', icon: Shield, color: 'red' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-700',
              green: 'bg-green-50 border-green-200 text-green-700',
              purple: 'bg-purple-50 border-purple-200 text-purple-700',
              orange: 'bg-orange-50 border-orange-200 text-orange-700',
              indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
              red: 'bg-red-50 border-red-200 text-red-700'
            };

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                  isActive 
                    ? `${colorClasses[tab.color as keyof typeof colorClasses]} border-l-4` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>CMS v1.0</span>
          <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
            <Settings className="w-3 h-3" />
            <span>Config</span>
          </button>
        </div>
      </div>
    </div>
  );
}
