/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true
  },
  swcMinify: false,
  eslint: { ignoreDuringBuilds: true },
  experimental: { 
    externalDir: true,
    serverComponentsExternalPackages: ['@prisma/client']
  },
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Alias '@' para importar desde la raíz de apps/web
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    // Mantener las extensiones .ts y .tsx
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/_tw.css',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

module.exports = nextConfig;
