import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    servicios: [
      { name: 'Testing Manual', href: '/servicios#manual' },
      { name: 'Testing Automatizado', href: '/servicios#automatizado' },
      { name: 'Testing de Performance', href: '/servicios#performance' },
      { name: 'Consultoría QA', href: '/servicios#consultoria' },
    ],
    aprendizaje: [
      { name: 'Cursos Online', href: '/aprendizaje#cursos' },
      { name: 'Tutoriales', href: '/aprendizaje#tutoriales' },
      { name: 'Certificaciones', href: '/aprendizaje#certificaciones' },
      { name: 'Comunidad', href: '/aprendizaje#comunidad' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { name: 'Equipo', href: '/equipo' },
      { name: 'Carreras', href: '/carreras' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Términos de Servicio', href: '/terminos' },
      { name: 'Política de Privacidad', href: '/privacidad' },
      { name: 'Cookies', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo y Descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="text-xl font-bold text-white">QA Services</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Plataforma integral de servicios de QA testing y hub de conocimientos 
              para profesionales del software. Transformamos la calidad del código.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 4.438 21.8 10.207 23.387c.76.138 1.037-.329 1.037-.746 0-.373-.013-1.635-.013-2.968 0-1.004.325-2.058.893-2.894-.09-.22-.375-1.128-.832-2.384 0 0-.68-.231-2.254.88-.656-.18-1.36-.275-2.06-.275-.7 0-1.404.095-2.06.275-1.574-1.111-2.254-.88-2.254-.88-.457 1.256-.742 2.164-.832 2.384.568.836.893 1.89.893 2.894 0 1.635-.013 2.968-.013 2.968 0 .417.277.884 1.037.746C19.562 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Servicios
            </h3>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aprendizaje */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Aprendizaje
            </h3>
            <ul className="space-y-3">
              {footerLinks.aprendizaje.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} QA Services. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
