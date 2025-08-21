import React, { useState, useEffect } from 'react';

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
  isActive: boolean;
  properties: ComponentProperty[];
  _count: {
    instances: number;
    versions: number;
  };
}

interface ComponentInstance {
  id: string;
  component: Component;
  page?: {
    title: string;
    slug: string;
  };
  data: any;
  order: number;
  parent?: {
    id: string;
    component: { name: string };
  };
  children: ComponentInstance[];
}

export default function CMSComponentManager() {
  const [components, setComponents] = useState<Component[]>([]);
  const [instances, setInstances] = useState<ComponentInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'instances'>('components');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Estados para crear componente
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    properties: [] as any[]
  });

  // Estados para crear instancia
  const [newInstance, setNewInstance] = useState({
    componentId: '',
    pageId: '',
    data: {},
    order: 0,
    parentId: ''
  });

  useEffect(() => {
    loadComponents();
    loadInstances();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cms/components');
      if (response.ok) {
        const data = await response.json();
        setComponents(data.components);
      }
    } catch (error) {
      console.error('Error loading components:', error);
    }
    setLoading(false);
  };

  const loadInstances = async () => {
    try {
      const response = await fetch('/api/cms/components/instances');
      if (response.ok) {
        const data = await response.json();
        setInstances(data.instances);
      }
    } catch (error) {
      console.error('Error loading instances:', error);
    }
  };

  const handleCreateComponent = async () => {
    try {
      const response = await fetch('/api/cms/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComponent)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewComponent({ name: '', type: '', category: '', description: '', properties: [] });
        loadComponents();
      }
    } catch (error) {
      console.error('Error creating component:', error);
    }
  };

  const handleCreateInstance = async () => {
    try {
      const response = await fetch('/api/cms/components/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstance)
      });

      if (response.ok) {
        setShowInstanceModal(false);
        setNewInstance({ componentId: '', pageId: '', data: {}, order: 0, parentId: '' });
        loadInstances();
      }
    } catch (error) {
      console.error('Error creating instance:', error);
    }
  };

  const addProperty = () => {
    setNewComponent(prev => ({
      ...prev,
      properties: [...prev.properties, {
        name: '',
        type: 'string',
        value: '',
        required: false,
        options: [],
        order: prev.properties.length
      }]
    }));
  };

  const updateProperty = (index: number, field: string, value: any) => {
    setNewComponent(prev => ({
      ...prev,
      properties: prev.properties.map((prop, i) => 
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  const removeProperty = (index: number) => {
    setNewComponent(prev => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index)
    }));
  };

  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || comp.type === filterType;
    const matchesCategory = !filterCategory || comp.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      layout: 'bg-blue-100 text-blue-800',
      block: 'bg-green-100 text-green-800',
      ui: 'bg-purple-100 text-purple-800',
      form: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      navigation: '🧭',
      content: '📄',
      interaction: '🖱️',
      media: '🖼️',
      input: '⌨️'
    };
    return icons[category] || '🔧';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestor de Componentes</h2>
            <p className="text-sm text-gray-600">Gestiona componentes reutilizables y sus instancias</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ✨ Crear Componente
            </button>
            <button
              onClick={() => setShowInstanceModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🔧 Crear Instancia
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('components')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'components'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Componentes ({components.length})
          </button>
          <button
            onClick={() => setActiveTab('instances')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'instances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Instancias ({instances.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="layout">Layout</option>
            <option value="block">Block</option>
            <option value="ui">UI</option>
            <option value="form">Form</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            <option value="navigation">Navegación</option>
            <option value="content">Contenido</option>
            <option value="interaction">Interacción</option>
            <option value="media">Media</option>
            <option value="input">Input</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando componentes...</p>
          </div>
        ) : activeTab === 'components' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <div key={component.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(component.category)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(component.type)}`}>
                        {component.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{component._count.instances} instancias</span>
                    <span className="text-xs text-gray-500">{component._count.versions} versiones</span>
                  </div>
                </div>
                
                {component.description && (
                  <p className="text-sm text-gray-600 mb-4">{component.description}</p>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Propiedades:</h4>
                  {component.properties.slice(0, 3).map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{prop.name}</span>
                      <span className="text-gray-400">{prop.type}</span>
                    </div>
                  ))}
                  {component.properties.length > 3 && (
                    <p className="text-xs text-gray-400">+{component.properties.length - 3} más...</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedComponent(component);
                      setShowInstanceModal(true);
                    }}
                    className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm"
                  >
                    🔧 Crear Instancia
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {instances.map((instance) => (
              <div key={instance.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getCategoryIcon(instance.component.category)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {instance.component.name} - Instancia
                      </h3>
                      <p className="text-sm text-gray-600">
                        {instance.page ? `Página: ${instance.page.title}` : 'Sin página asignada'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Orden: {instance.order}
                  </div>
                </div>
                
                {Object.keys(instance.data).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Datos:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(instance.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Component Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Crear Nuevo Componente</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="layout_header"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={newComponent.type}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="layout">Layout</option>
                    <option value="block">Block</option>
                    <option value="ui">UI</option>
                    <option value="form">Form</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={newComponent.category}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="navigation">Navegación</option>
                    <option value="content">Contenido</option>
                    <option value="interaction">Interacción</option>
                    <option value="media">Media</option>
                    <option value="input">Input</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={newComponent.description}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción del componente..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Propiedades</label>
                  <button
                    onClick={addProperty}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                  >
                    + Agregar Propiedad
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newComponent.properties.map((prop, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Nombre"
                          value={prop.name}
                          onChange={(e) => updateProperty(index, 'name', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <select
                          value={prop.type}
                          onChange={(e) => updateProperty(index, 'type', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="color">Color</option>
                          <option value="select">Select</option>
                          <option value="image">Image</option>
                          <option value="array">Array</option>
                          <option value="richtext">Rich Text</option>
                        </select>
                        <button
                          onClick={() => removeProperty(index)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Valor por defecto"
                          value={prop.value}
                          onChange={(e) => updateProperty(index, 'value', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={prop.required}
                            onChange={(e) => updateProperty(index, 'required', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Requerido</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateComponent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crear Componente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Instance Modal */}
      {showInstanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Instancia</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Componente</label>
                <select
                  value={newInstance.componentId}
                  onChange={(e) => setNewInstance(prev => ({ ...prev, componentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar componente</option>
                  {components.map(comp => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} ({comp.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Página (opcional)</label>
                <select
                  value={newInstance.pageId}
                  onChange={(e) => setNewInstance(prev => ({ ...prev, pageId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin página específica</option>
                  {/* Aquí podrías cargar las páginas disponibles */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={newInstance.order}
                  onChange={(e) => setNewInstance(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInstanceModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateInstance}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Crear Instancia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
