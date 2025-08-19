'use client';

import { useState } from 'react';
import { X, Save, Undo, Palette, Type, Image } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
}

interface CMSPanelProps {
  block: Block;
  onClose: () => void;
  onUpdate: (blockId: string, newContent: any) => void;
}

export function CMSPanel({ block, onClose, onUpdate }: CMSPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Propiedades</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Bloque: {block.type} ({block.id})</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Type className="w-4 h-4 inline mr-2" />
          Contenido
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'style'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Estilo
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'advanced'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Image className="w-4 h-4 inline mr-2" />
          Avanzado
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Editar Contenido</h4>
            
            {block.type === 'hero' && (
              <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el título..."
                    value={block.content.title || ''}
                    onChange={(e) => onUpdate(block.id, { title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Ingresa el subtítulo..."
                    value={block.content.subtitle || ''}
                    onChange={(e) => onUpdate(block.id, { subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto del Botón
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Texto del botón..."
                    value={block.content.buttonText || ''}
                    onChange={(e) => onUpdate(block.id, { buttonText: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace del Botón
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/ruta-del-enlace"
                    value={block.content.buttonLink || ''}
                    onChange={(e) => onUpdate(block.id, { buttonLink: e.target.value })}
                  />
                </div>
              </>
            )}

            {block.type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    placeholder="Escribe tu contenido..."
                    value={block.content.text || ''}
                    onChange={(e) => onUpdate(block.id, { text: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alineación
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={block.content.alignment || 'left'}
                    onChange={(e) => onUpdate(block.id, { alignment: e.target.value })}
                  >
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de Fuente
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={block.content.fontSize || 'base'}
                    onChange={(e) => onUpdate(block.id, { fontSize: e.target.value })}
                  >
                    <option value="sm">Pequeño</option>
                    <option value="base">Normal</option>
                    <option value="lg">Grande</option>
                    <option value="xl">Extra Grande</option>
                  </select>
                </div>
              </>
            )}

            {block.type === 'services' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Sección
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título de servicios..."
                    value={block.content.title || ''}
                    onChange={(e) => onUpdate(block.id, { title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios
                  </label>
                  {block.content.services?.map((service: any, index: number) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg mb-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre del servicio"
                        value={service.name || ''}
                        onChange={(e) => {
                          const newServices = [...(block.content.services || [])];
                          newServices[index] = { ...service, name: e.target.value };
                          onUpdate(block.id, { services: newServices });
                        }}
                      />
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Descripción del servicio"
                        value={service.description || ''}
                        onChange={(e) => {
                          const newServices = [...(block.content.services || [])];
                          newServices[index] = { ...service, description: e.target.value };
                          onUpdate(block.id, { services: newServices });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {block.type === 'testimonial' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Escribe el testimonio..."
                    value={block.content.quote || ''}
                    onChange={(e) => onUpdate(block.id, { quote: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del autor"
                    value={block.content.author || ''}
                    onChange={(e) => onUpdate(block.id, { author: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cargo del autor"
                    value={block.content.position || ''}
                    onChange={(e) => onUpdate(block.id, { position: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Empresa del autor"
                    value={block.content.company || ''}
                    onChange={(e) => onUpdate(block.id, { company: e.target.value })}
                  />
                </div>
              </>
            )}

            {block.type === 'code' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                  placeholder="// Escribe tu código aquí..."
                  value={block.content.code || ''}
                  onChange={(e) => onUpdate(block.id, { code: e.target.value })}
              />
            </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Personalizar Estilo</h4>
            
            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Fondo
              </label>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-blue-50 border-2 border-gray-300 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-green-50 border-2 border-gray-300 rounded cursor-pointer"></div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de Fuente
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="sm">Pequeño</option>
                <option value="base">Normal</option>
                <option value="lg">Grande</option>
                <option value="xl">Extra Grande</option>
              </select>
            </div>

            {/* Spacing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Espaciado
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Padding"
                  defaultValue="16"
                />
                <input
                  type="number"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Margin"
                  defaultValue="24"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Opciones Avanzadas</h4>
            
            {/* CSS Classes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clases CSS Personalizadas
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="custom-class another-class"
              />
            </div>

            {/* Responsive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comportamiento Responsivo
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Ocultar en móvil
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Ocultar en tablet
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Ocultar en escritorio
                </label>
              </div>
            </div>

            {/* Animation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animación
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sin animación</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-up">Slide Up</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Undo className="w-4 h-4 mr-2" />
            Deshacer
          </button>
          <button 
            onClick={() => console.log('Cambios aplicados automáticamente')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardado Automático
          </button>
        </div>
      </div>
    </div>
  );
}
