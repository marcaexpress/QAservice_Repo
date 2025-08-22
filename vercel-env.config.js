/**
 * Configuración de entorno específica para Vercel
 * Este archivo se usa para configurar las variables de entorno durante el build
 */

module.exports = {
  // Configuración para ignorar errores de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración para ignorar errores de ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración experimental
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Configuración de transpilación
  transpilePackages: ['@qa-services/ui', '@qa-services/cms-core', '@qa-services/config'],
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
  },
  
  // Configuración de webpack para ignorar errores
  webpack: (config, { isServer }) => {
    // Ignorar errores de TypeScript en webpack
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module not found/,
      /Can't resolve/,
    ];
    
    return config;
  },
};
