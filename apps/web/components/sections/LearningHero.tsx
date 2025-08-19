import { Button } from '@/components/ui/Button';

export function LearningHero() {
  return (
    <section className="section-padding bg-gradient-to-br from-green-600 to-emerald-700 text-white">
      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Aprende{' '}
          <span className="text-green-200">QA Testing</span>{' '}
          de Forma Interactiva
        </h1>
        
        <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
          Desarrolla habilidades profesionales en testing de software con nuestros 
          cursos, tutoriales y recursos prácticos. Desde principiantes hasta expertos.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Comenzar a Aprender
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-600">
            Ver Cursos Gratuitos
          </Button>
        </div>
      </div>
    </section>
  );
}
