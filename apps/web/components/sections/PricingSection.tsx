import { Button } from '@/components/ui/Button';

export function PricingSection() {
  const plans = [
    {
      name: 'Básico',
      price: 'Desde $2,500',
      description: 'Ideal para startups y proyectos pequeños',
      features: [
        'Testing manual básico',
        'Reportes de bugs',
        'Validación funcional',
        'Soporte por email',
        'Entrega en 1-2 semanas'
      ],
      popular: false
    },
    {
      name: 'Profesional',
      price: 'Desde $5,000',
      description: 'Perfecto para empresas en crecimiento',
      features: [
        'Testing manual completo',
        'Testing automatizado básico',
        'Testing de performance',
        'Soporte prioritario',
        'Entrega en 2-3 semanas',
        'Reportes detallados'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      description: 'Para grandes empresas y proyectos complejos',
      features: [
        'Testing completo integral',
        'Automatización avanzada',
        'Testing de seguridad',
        'Soporte 24/7',
        'Equipo dedicado',
        'Integración CI/CD',
        'Consultoría especializada'
      ],
      popular: false
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos planes flexibles que se adaptan a las necesidades 
            de tu proyecto y presupuesto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {plan.price}
                </div>
                <p className="text-gray-600">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {plan.name === 'Enterprise' ? 'Contactar Ventas' : 'Comenzar Ahora'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Necesitas un plan personalizado o tienes preguntas sobre precios?
          </p>
          <Button variant="outline" size="lg">
            Contactar para Consulta Personalizada
          </Button>
        </div>
      </div>
    </section>
  );
}
