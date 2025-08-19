import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="section-padding bg-primary-600">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para Transformar tu Proceso de Testing?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
          Únete a cientos de profesionales que ya están mejorando la calidad 
          de su software con nuestros servicios y herramientas de aprendizaje.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contacto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Solicitar Consulta Gratuita
            </Button>
          </Link>
          <Link href="/auth/registro">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
              Crear Cuenta Gratuita
            </Button>
          </Link>
        </div>
        
        <p className="text-primary-200 mt-6 text-sm">
          Sin compromisos • Acceso inmediato • Soporte incluido
        </p>
      </div>
    </section>
  );
}
