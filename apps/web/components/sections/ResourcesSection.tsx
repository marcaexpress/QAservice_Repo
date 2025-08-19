import { Button } from '@/components/ui/Button';

export function ResourcesSection() {
  const resources = [
    {
      title: 'Blog de QA Testing',
      description: 'Artículos técnicos, mejores prácticas y casos de estudio del mundo del testing.',
      icon: '📝',
      link: '/blog',
      type: 'Gratuito'
    },
    {
      title: 'Tutoriales en Video',
      description: 'Videos paso a paso sobre herramientas y técnicas de testing.',
      icon: '🎥',
      link: '/tutoriales',
      type: 'Gratuito'
    },
    {
      title: 'Plantillas de Testing',
      description: 'Plantillas descargables para casos de prueba, reportes de bugs y planes de testing.',
      icon: '📋',
      link: '/plantillas',
      type: 'Gratuito'
    },
    {
      title: 'Comunidad QA',
      description: 'Foro de discusión y networking con otros profesionales del testing.',
      icon: '👥',
      link: '/comunidad',
      type: 'Gratuito'
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recursos Gratuitos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accede a una amplia biblioteca de recursos gratuitos para 
            mejorar tus habilidades en QA testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                  {resource.type}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 text-center">
                {resource.description}
              </p>
              
              <Button variant="outline" className="w-full">
                Acceder
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg">
            Explorar Todos los Recursos
          </Button>
        </div>
      </div>
    </section>
  );
}
