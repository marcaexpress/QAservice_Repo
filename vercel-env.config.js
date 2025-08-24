/**
 * Configuración de entorno específica para Vercel
 * Este archivo se usa para configurar las variables de entorno durante el build
 */

module.exports = {
  // No ignorar errores críticos en producción
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['@qa-services/ui', '@qa-services/cms-core', '@qa-services/config'],
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Solo ignorar warnings menores
    config.ignoreWarnings = [
      /Failed to parse source map/
    ];
    return config;
  },
};
