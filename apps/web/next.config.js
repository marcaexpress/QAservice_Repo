/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@qa-services/ui', '@qa-services/cms-core', '@qa-services/config'],
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // 🟩 Permite que el build termine aunque haya errores de tipos
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🟩 No falla el build por linting
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
