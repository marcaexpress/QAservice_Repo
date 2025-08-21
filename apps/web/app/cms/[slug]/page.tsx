'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CMSService, PageAccessControl } from '@/lib/cms-service';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
  metadata?: any;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
  publishedAt?: Date;
  blocks: Block[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  organizationId?: string;
}

export default function CMSPageView() {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      loadPage(slug);
    }
  }, [slug]);

  const loadPage = async (pageSlug: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user info from cookies/token if available
      let accessControl: PageAccessControl = {
        userId: 'anonymous',
        userRoles: ['public'],
        organizationId: undefined
      };

      // Try to get user info from auth token
      try {
        const response = await fetch('/api/admin/session');
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.user) {
            accessControl = {
              userId: data.user.id,
              userRoles: data.user.roles,
              organizationId: data.user.organizationId
            };
          }
        }
      } catch (error) {
        // Continue as anonymous user
        console.log('No authenticated user, continuing as anonymous');
      }

      // Load page from public API
      const response = await fetch(`/api/cms/public?slug=${pageSlug}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Página no encontrada');
        return;
      }

      setPage(result.page);
    } catch (error) {
      console.error('Error loading page:', error);
      setError('Error al cargar la página');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div key={block.id} className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {block.content.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {block.content.subtitle}
            </p>
            {block.content.buttonText && block.content.buttonLink && (
              <a
                href={block.content.buttonLink}
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                {block.content.buttonText}
              </a>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={block.id} className={`py-12 max-w-4xl mx-auto px-6 text-${block.content.alignment || 'left'}`}>
            <p className={`text-${block.content.fontSize || 'base'} text-gray-700 leading-relaxed`}>
              {block.content.text}
            </p>
          </div>
        );

      case 'services':
        return (
          <div key={block.id} className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                {block.content.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {block.content.services?.map((service: any, index: number) => (
                  <div key={index} className="bg-blue-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">
                      {service.name}
                    </h3>
                    <p className="text-blue-700 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <blockquote className="text-2xl text-gray-700 mb-8 italic">
                "{block.content.quote}"
              </blockquote>
              <div className="text-lg text-gray-600">
                <p className="font-semibold">{block.content.author}</p>
                <p>{block.content.position}, {block.content.company}</p>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div key={block.id} className="py-12 max-w-4xl mx-auto px-6 text-center">
            <img
              src={block.content.src || '/placeholder.jpg'}
              alt={block.content.alt || 'Imagen'}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            {block.content.caption && (
              <p className="text-sm text-gray-600">{block.content.caption}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div key={block.id} className="py-12 max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {block.content.title}
            </h3>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {block.content.src ? (
                <iframe
                  src={block.content.src}
                  title={block.content.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              ) : (
                <div className="text-gray-500">
                  <div className="text-4xl mb-2">🎥</div>
                  <div className="text-sm">Video no disponible</div>
                </div>
              )}
            </div>
            {block.content.description && (
              <p className="text-gray-600">{block.content.description}</p>
            )}
          </div>
        );

      case 'code':
        return (
          <div key={block.id} className="py-12 max-w-4xl mx-auto px-6">
            <div className="bg-gray-900 text-green-400 p-8 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{block.content.code}</pre>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div key={block.id} className="py-12 max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {block.content.title}
            </h3>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-lg">Gráfico {block.content.type}</div>
                <div className="text-sm">Visualización de datos</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={block.id} className="py-8 max-w-4xl mx-auto px-6 text-center text-gray-500">
            <p>Bloque de tipo "{block.type}" no soportado</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando página...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
          <p className="text-gray-600 mb-6">La página que buscas no existe o no está disponible</p>
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-gray-600 mt-2">{page.description}</p>
          )}
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <span>Última actualización: {new Date(page.updatedAt).toLocaleDateString()}</span>
            {page.status === 'PUBLISHED' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Publicada
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {page.blocks
          .sort((a, b) => a.order - b.order)
          .map(renderBlock)}
      </main>

      {/* Page Footer */}
      <footer className="bg-gray-50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p className="text-sm">
            Contenido gestionado por el CMS de QA Services
          </p>
          <p className="text-xs mt-2">
            Página: {page.slug} • ID: {page.id}
          </p>
        </div>
      </footer>
    </div>
  );
}
