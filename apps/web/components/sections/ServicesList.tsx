export function ServicesList() {
  const services = [
    {
      id: 'manual',
      title: 'Testing Manual',
      description: 'Pruebas manuales exhaustivas para validar funcionalidad, usabilidad y experiencia del usuario.',
      features: [
        'Casos de prueba detallados y documentados',
        'Reportes de bugs con reproducción paso a paso',
        'Validación de UX/UI y accesibilidad',
        'Testing de compatibilidad cross-browser',
        'Validación de requisitos funcionales'
      ],
      icon: '✓'
    },
    {
      id: 'automatizado',
      title: 'Testing Automatizado',
      description: 'Implementación de frameworks de testing automatizado para CI/CD y regresión continua.',
      features: [
        'Selenium WebDriver para web apps',
        'Cypress para testing E2E moderno',
        'Playwright para multi-browser',
        'Integración con CI/CD pipelines',
        'Mantenimiento de scripts automatizados'
      ],
      icon: '⚡'
    },
    {
      id: 'performance',
      title: 'Testing de Performance',
      description: 'Análisis de rendimiento, carga y estrés para garantizar escalabilidad de aplicaciones.',
      features: [
        'JMeter para testing de carga',
        'K6 para testing de performance moderno',
        'Análisis de métricas y KPIs',
        'Optimización de rendimiento',
        'Testing de estrés y límites'
      ],
      icon: '🚀'
    },
    {
      id: 'seguridad',
      title: 'Testing de Seguridad',
      description: 'Auditorías de seguridad, análisis de vulnerabilidades y pruebas de penetración.',
      features: [
        'OWASP Top 10 compliance',
        'Análisis estático de código',
        'Testing de penetración',
        'Auditorías de seguridad',
        'Reportes de vulnerabilidades'
      ],
      icon: '🔒'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios en Detalle
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada servicio está diseñado para abordar necesidades específicas 
            del proceso de testing y garantizar la calidad del software.
          </p>
        </div>

        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={service.id} id={service.id} className="scroll-mt-20">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="text-6xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gray-50 rounded-2xl p-8 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl text-primary-200 mb-4">{service.icon}</div>
                      <p className="text-gray-500 text-sm">Ilustración del servicio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
