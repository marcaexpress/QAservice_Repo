import { Button } from '@/components/ui/Button';

export function ServicesSection() {
  const services = [
    {
      title: 'Testing Manual',
      description: 'Pruebas manuales exhaustivas para validar funcionalidad, usabilidad y experiencia del usuario.',
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: ['Casos de prueba detallados', 'Reportes de bugs', 'Validación de UX/UI', 'Testing de accesibilidad']
    },
    {
      title: 'Testing Automatizado',
      description: 'Implementación de frameworks de testing automatizado para CI/CD y regresión continua.',
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: ['Selenium WebDriver', 'Cypress', 'Playwright', 'Integración CI/CD']
    },
    {
      title: 'Testing de Performance',
      description: 'Análisis de rendimiento, carga y estrés para garantizar escalabilidad de aplicaciones.',
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: ['JMeter', 'K6', 'Análisis de métricas', 'Optimización de rendimiento']
    },
    {
      title: 'Testing de Seguridad',
      description: 'Auditorías de seguridad, análisis de vulnerabilidades y pruebas de penetración.',
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      features: ['OWASP Top 10', 'Análisis estático', 'Testing de penetración', 'Auditorías de código']
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicios Profesionales de QA Testing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones integrales de testing para garantizar la calidad, 
            rendimiento y seguridad de tu software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full">
                Solicitar Cotización
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">
            Ver Todos los Servicios
          </Button>
        </div>
      </div>
    </section>
  );
}
