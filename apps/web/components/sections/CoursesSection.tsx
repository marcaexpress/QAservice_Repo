import { Button } from '@/components/ui/Button';

export function CoursesSection() {
  const courses = [
    {
      title: 'Fundamentos de QA Testing',
      level: 'Principiante',
      duration: '4 semanas',
      description: 'Aprende los conceptos básicos del testing de software, tipos de testing y metodologías.',
      topics: ['Conceptos básicos', 'Tipos de testing', 'Metodologías', 'Casos de prueba'],
      price: 'Gratuito',
      image: '📚'
    },
    {
      title: 'Testing Automatizado con Selenium',
      level: 'Intermedio',
      duration: '6 semanas',
      description: 'Domina Selenium WebDriver para crear tests automatizados robustos y mantenibles.',
      topics: ['Selenium WebDriver', 'Java/Python', 'Page Object Model', 'CI/CD'],
      price: '$99',
      image: '⚡'
    },
    {
      title: 'Testing de Performance con JMeter',
      level: 'Avanzado',
      duration: '5 semanas',
      description: 'Aprende a realizar testing de performance y carga con Apache JMeter.',
      topics: ['JMeter', 'Testing de carga', 'Análisis de métricas', 'Optimización'],
      price: '$149',
      image: '🚀'
    },
    {
      title: 'Testing de Seguridad Web',
      level: 'Avanzado',
      duration: '4 semanas',
      description: 'Identifica y previene vulnerabilidades de seguridad en aplicaciones web.',
      topics: ['OWASP Top 10', 'Testing de penetración', 'Análisis estático', 'Reportes'],
      price: '$199',
      image: '🔒'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cursos Disponibles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestros cursos están diseñados por expertos en la industria 
            y cubren desde fundamentos hasta técnicas avanzadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{course.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {course.level}
                  </span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-3">
                  {course.price}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 text-center">
                {course.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Temas cubiertos:</h4>
                <ul className="space-y-2">
                  {course.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button variant="primary" className="w-full">
                {course.price === 'Gratuito' ? 'Comenzar Curso' : 'Inscribirse'}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Todos los Cursos
          </Button>
        </div>
      </div>
    </section>
  );
}
