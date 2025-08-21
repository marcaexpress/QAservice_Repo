import { cmsService } from '@/lib/cms-service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = params;

  // Obtener la página del servicio CMS centralizado
  const page = await cmsService.getPage(slug);

  if (!page) {
    notFound();
  }

  // Solo mostrar páginas publicadas para usuarios públicos
  if (page.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header de la página */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-xl text-gray-600">
              {page.description}
            </p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
            <span>Última actualización: {new Date(page.updatedAt).toLocaleDateString()}</span>
            {page.publishedAt && (
              <span>Publicado: {new Date(page.publishedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </header>

      {/* Contenido de la página */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {page.blocks && (page.blocks as any[]).length > 0 ? (
          <div className="space-y-8">
            {(page.blocks as any[]).map((block: any, index: number) => (
              <div key={block.id || index} className="block-content">
                {renderBlock(block)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Página sin contenido
            </h3>
            <p className="text-gray-600">
              Esta página aún no tiene contenido. Los editores pueden agregar bloques de contenido.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Función para renderizar bloques de contenido
function renderBlock(block: any) {
  switch (block.type) {
    case 'hero':
      return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{block.content?.title || 'Título del Hero'}</h2>
          <p className="text-xl mb-6">{block.content?.subtitle || 'Subtítulo del hero'}</p>
          {block.content?.buttonText && (
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {block.content.buttonText}
            </button>
          )}
        </div>
      );

    case 'text':
      return (
        <div className={`text-${block.content?.fontSize || 'base'} text-gray-700`}>
          <p className={block.content?.alignment === 'center' ? 'text-center' : ''}>
            {block.content?.text || 'Texto del bloque'}
          </p>
        </div>
      );

    case 'services':
      return (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {block.content?.title || 'Servicios'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(block.content?.services || []).map((service: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <blockquote className="text-xl text-gray-700 mb-4">
            "{block.content?.quote || 'Testimonio del cliente'}"
          </blockquote>
          <div className="text-gray-600">
            <p className="font-semibold">{block.content?.author || 'Nombre del cliente'}</p>
            <p className="text-sm">{block.content?.position || 'Cargo'}</p>
            <p className="text-sm">{block.content?.company || 'Empresa'}</p>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="text-center">
          <img
            src={block.content?.src || '/placeholder.jpg'}
            alt={block.content?.alt || 'Imagen'}
            className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
          />
          {block.content?.caption && (
            <p className="text-sm text-gray-600 mt-2">{block.content.caption}</p>
          )}
        </div>
      );

    case 'video':
      return (
        <div className="text-center">
          <video
            src={block.content?.src}
            poster={block.content?.poster}
            controls={block.content?.controls !== false}
            autoPlay={block.content?.autoplay}
            className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
          />
        </div>
      );

    case 'stats':
      return (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {block.content?.title || 'Estadísticas'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(block.content?.stats || []).map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'code':
      return (
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400">
            <code>{block.content?.code || '// Tu código aquí'}</code>
          </pre>
        </div>
      );

    default:
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Tipo de bloque no reconocido: {block.type}
          </p>
        </div>
      );
  }
}
