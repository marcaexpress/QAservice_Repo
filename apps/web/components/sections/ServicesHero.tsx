import { Button } from '@/components/ui/Button';

export function ServicesHero() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 to-blue-700 text-white">
      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Servicios Profesionales de{' '}
          <span className="text-primary-200">QA Testing</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
          Ofrecemos soluciones integrales de testing para garantizar la calidad, 
          rendimiento y seguridad de tu software. Desde testing manual hasta 
          automatización completa.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Solicitar Cotización
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
            Ver Casos de Estudio
          </Button>
        </div>
      </div>
    </section>
  );
}
