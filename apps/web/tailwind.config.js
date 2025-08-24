// apps/web/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    
    // ⬇️ Rutas específicas para monorepo
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Colores personalizados
    'bg-primary-50', 'bg-primary-100', 'bg-primary-600', 'bg-primary-700',
    'text-primary-600', 'text-gray-900', 'text-gray-600', 'text-white',
    'bg-blue-50', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-900',
    
    // Layout crítico
    'section-padding', 'container-custom', 'space-y-20',
    'flex', 'flex-col', 'sm:flex-row', 'gap-4', 'gap-8',
    'w-full', 'sm:w-auto', 'items-center', 'justify-center',
    
    // Grid y espaciado
    'grid', 'grid-cols-1', 'md:grid-cols-3', 'mt-12',
    'text-center', 'max-w-4xl', 'mx-auto',
    
    // Tipografía
    'text-4xl', 'md:text-6xl', 'text-xl', 'md:text-2xl', 'text-lg',
    'font-bold', 'font-semibold', 'font-medium',
    'mb-2', 'mb-4', 'mb-6', 'mb-8',
    'leading-tight', 'leading-relaxed',
    
    // Iconos
    'w-16', 'h-16', 'w-8', 'h-8', 'rounded-full',
    
    // Botones
    'inline-flex', 'rounded-lg', 'transition-all', 'duration-200',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2',
    'disabled:opacity-50', 'disabled:cursor-not-allowed',
    
    // Variantes de botón
    'bg-primary-600', 'hover:bg-primary-700', 'focus:ring-primary-500',
    'bg-gray-200', 'hover:bg-gray-300', 'focus:ring-gray-500',
    'border-2', 'border-primary-600', 'hover:bg-primary-600', 'hover:text-white',
    'hover:text-primary-600', 'hover:bg-gray-100',
    
    // Tamaños de botón
    'px-3', 'py-2', 'text-sm', 'px-4', 'px-6', 'py-3', 'text-base',
    
    // Animaciones
    'animate-spin', '-ml-1', 'mr-2', 'h-4', 'w-4',
    
    // Responsive
    'md:grid-cols-2', 'md:grid-cols-3',
  ],
  theme: { 
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    } 
  },
  plugins: [],
};
