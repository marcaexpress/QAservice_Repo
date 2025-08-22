import React, { useState, useEffect } from 'react';
import { Edit3, Settings, Eye, EyeOff } from 'lucide-react';

interface ComponentProperty {
  id: string;
  name: string;
  type: string;
  value?: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface Component {
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  properties: ComponentProperty[];
}

interface ComponentBlockProps {
  block: {
    id: string;
    type: string;
    content: {
      componentId: string;
      properties: any;
      instanceId?: string;
    };
    order: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (blockId: string, newContent: any) => void;
  onDelete: (blockId: string) => void;
}

export default function ComponentBlockRenderer({ 
  block, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete 
}: ComponentBlockProps) {
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [properties, setProperties] = useState<any>(block.content.properties || {});
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadComponent();
  }, [block.content.componentId]);

  const loadComponent = async () => {
    try {
      const response = await fetch(`/api/cms/components/${block.content.componentId}`);
      if (response.ok) {
        const data = await response.json();
        setComponent(data.component);
        // Inicializar propiedades con valores por defecto
        const defaultProps: any = {};
        data.component.properties.forEach((prop: ComponentProperty) => {
          if (prop.value !== undefined) {
            defaultProps[prop.name] = prop.value;
          }
        });
        setProperties({ ...defaultProps, ...block.content.properties });
      }
    } catch (error) {
      console.error('Error loading component:', error);
    }
    setLoading(false);
  };

  const handlePropertyChange = (propertyName: string, value: any) => {
    const newProperties = { ...properties, [propertyName]: value };
    setProperties(newProperties);
    
    // Actualizar el contenido del bloque
    const updatedContent = { 
      ...block.content, 
      properties: newProperties 
    };
    onUpdate(block.id, updatedContent);
  };

  const renderPropertyEditor = (property: ComponentProperty) => {
    const value = properties[property.name] || property.value || '';

    switch (property.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={property.required ? 'Requerido' : 'Opcional'}
          />
        );
      
      case 'array':
        if (property.name === 'menuItems') {
          // Editor especial para elementos de menú con enlaces
          return (
            <div className="space-y-2">
              {Array.isArray(value) && value.length > 0 ? (
                value.map((item: any, index: number) => (
                  <div key={index} className="flex space-x-2 p-2 border border-gray-200 rounded">
                    <input
                      type="text"
                      value={item.text || ''}
                      onChange={(e) => {
                        const newItems = [...value];
                        newItems[index] = { ...item, text: e.target.value };
                        handlePropertyChange(property.name, newItems);
                      }}
                      placeholder="Texto del menú"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => {
                        const newItems = [...value];
                        newItems[index] = { ...item, href: e.target.value };
                        handlePropertyChange(property.name, newItems);
                      }}
                      placeholder="/ruta"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => {
                        const newItems = value.filter((_, i) => i !== index);
                        handlePropertyChange(property.name, newItems);
                      }}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : null}
              <button
                onClick={() => {
                  const newItems = [...(value || []), { text: 'Nuevo Item', href: '/' }];
                  handlePropertyChange(property.name, newItems);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                + Agregar Item de Menú
              </button>
            </div>
          );
        }
        
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChange={(e) => {
                const arrayValue = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                handlePropertyChange(property.name, arrayValue);
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Elemento1, Elemento2, Elemento3"
            />
            <p className="text-xs text-gray-500">Separar elementos con comas</p>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handlePropertyChange(property.name, parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );
      
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value === 'true' || value === true}
            onChange={(e) => handlePropertyChange(property.name, e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );
      
      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            className="w-full h-8 border border-gray-300 rounded cursor-pointer"
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {property.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handlePropertyChange(property.name, e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="URL de la imagen"
            />
            {value && (
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => handlePropertyChange(property.name, '/placeholder.jpg')}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Placeholder
              </button>
              <button
                onClick={() => handlePropertyChange(property.name, 'https://via.placeholder.com/400x200')}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Via Placeholder
              </button>
            </div>
          </div>
        );
      
      case 'pages':
        // Selector de páginas del CMS
        return (
          <div className="space-y-2">
            <select
              value={value}
              onChange={(e) => handlePropertyChange(property.name, e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Seleccionar página</option>
              <option value="/">Página Principal</option>
              <option value="/servicios">Servicios</option>
              <option value="/contacto">Contacto</option>
              <option value="/aprendizaje">Aprendizaje</option>
              <option value="/sobre-nosotros">Sobre Nosotros</option>
            </select>
            <p className="text-xs text-gray-500">Selecciona una página existente del sitio</p>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );
    }
  };

  const renderPreview = () => {
    if (!component) return null;

    // Renderizado funcional del componente basado en su tipo
    switch (component.type) {
      case 'layout':
        if (component.name === 'layout_header') {
          return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: properties.backgroundColor || '#ffffff' }}>
                <div className="flex items-center space-x-4">
                  {properties.logo ? (
                    <img src={properties.logo} alt="Logo" className="h-8 w-auto" />
                  ) : (
                    <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                  )}
                  <span className="text-lg font-semibold text-gray-900">{properties.siteName || 'Mi Sitio'}</span>
                </div>
                <nav className="flex space-x-6">
                  {Array.isArray(properties.menuItems) && properties.menuItems.map((item: any, index: number) => (
                    <a 
                      key={index} 
                      href={item.href || '#'} 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {item.text || `Item ${index + 1}`}
                    </a>
                  ))}
                </nav>
                <div className="flex items-center space-x-4">
                  {properties.showSearch && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {properties.showLogin && (
                    <a href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Iniciar Sesión
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center text-gray-600">
              <div className="text-lg font-semibold mb-2">{component.name}</div>
              <div className="text-sm">Layout Component</div>
              {Object.entries(properties).map(([key, value]) => (
                <div key={key} className="text-xs mt-1">
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'ui':
        if (component.name === 'ui_button') {
          return (
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="text-center">
                <button 
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    properties.size === 'small' ? 'px-4 py-2 text-sm' :
                    properties.size === 'large' ? 'px-8 py-4 text-lg' : 'px-6 py-3'
                  }`}
                  style={{ 
                    backgroundColor: properties.color || '#007bff',
                    color: properties.textColor || '#ffffff',
                    borderRadius: properties.rounded ? '9999px' : '0.5rem'
                  }}
                >
                  {properties.text || 'Botón'}
                </button>
                {properties.href && (
                  <p className="text-xs text-gray-500 mt-2">Enlace: {properties.href}</p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  {properties.size && `Tamaño: ${properties.size}`} • 
                  {properties.rounded ? ' Redondeado' : ' Cuadrado'}
                </div>
              </div>
            </div>
          );
        }
        
        if (component.name === 'gallery_grid') {
          return (
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {properties.title || 'Galería de Imágenes'}
                </h3>
                <p className="text-gray-600">
                  {properties.description || 'Colección de imágenes organizadas'}
                </p>
              </div>
              
              <div className={`grid gap-4 ${
                properties.columns === 2 ? 'grid-cols-2' :
                properties.columns === 3 ? 'grid-cols-3' :
                properties.columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
              }`}>
                {Array.isArray(properties.images) && properties.images.length > 0 ? (
                  properties.images.map((image: any, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url || '/placeholder.jpg'}
                        alt={image.alt || `Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                          <p className="text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p>No hay imágenes en la galería</p>
                  </div>
                )}
              </div>
            </div>
          );
        }
        
        if (component.name === 'ui_text') {
          return (
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="text-center">
                <p 
                  className="text-gray-900"
                  style={{ 
                    fontSize: properties.fontSize || '16px',
                    fontWeight: properties.bold ? 'bold' : 'normal',
                    textAlign: properties.alignment || 'left',
                    fontStyle: properties.italic ? 'italic' : 'normal',
                    textDecoration: properties.underline ? 'underline' : 'none'
                  }}
                >
                  {properties.text || 'Texto de ejemplo'}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {properties.fontSize && `Tamaño: ${properties.fontSize}`} • 
                  {properties.alignment && `Alineación: ${properties.alignment}`}
                  {properties.bold && ' • Negrita'} 
                  {properties.italic && ' • Cursiva'}
                  {properties.underline && ' • Subrayado'}
                </div>
              </div>
            </div>
          );
        }
        
        if (component.name === 'form_contact') {
          return (
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {properties.title || 'Formulario de Contacto'}
                </h3>
                <p className="text-gray-600">
                  {properties.description || 'Envíanos un mensaje y te responderemos pronto'}
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Asunto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  rows={4}
                  placeholder="Mensaje"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {properties.buttonText || 'Enviar Mensaje'}
                </button>
              </form>
            </div>
          );
        }
        
        return (
          <div className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900 mb-2">{component.name}</div>
              {properties.text && (
                <div className="text-sm text-gray-700">{properties.text}</div>
              )}
              {properties.href && (
                <a href={properties.href} className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {properties.buttonText || 'Enlace'}
                </a>
              )}
            </div>
          </div>
        );
      
      case 'block':
        return (
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-2">{component.name}</div>
              <div className="text-sm text-gray-600 mb-3">{component.description}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(properties).map(([key, value]) => (
                  <div key={key} className="text-left">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <div className="text-gray-600">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center text-gray-600">
              <div className="text-lg font-semibold mb-2">{component.name}</div>
              <div className="text-sm">{component.description}</div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className={`p-4 border-2 border-dashed border-gray-300 rounded-lg ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'bg-gray-50'
      }`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className={`p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 ${
        isSelected ? 'border-red-500' : ''
      }`}>
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-2">Error</div>
          <div className="text-sm">Componente no encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Toolbar del bloque */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPreviewMode(!previewMode);
          }}
          className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
          title={previewMode ? 'Modo edición' : 'Vista previa'}
        >
          {previewMode ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowProperties(!showProperties);
          }}
          className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
          title="Propiedades"
        >
          <Settings className="w-3 h-3" />
        </button>
      </div>

      {/* Contenido del bloque */}
      <div className="group">
        {previewMode ? (
          renderPreview()
        ) : (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center text-gray-600">
              <div className="text-lg font-semibold mb-2">{component.name}</div>
              <div className="text-sm">{component.description}</div>
              <div className="text-xs text-gray-500 mt-2">
                {component.properties.length} propiedades
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel de propiedades */}
      {showProperties && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Propiedades de {component.name}</h4>
            <button
              onClick={() => setShowProperties(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {component.properties.map((property) => (
              <div key={property.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {property.name}
                  {property.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderPropertyEditor(property)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
