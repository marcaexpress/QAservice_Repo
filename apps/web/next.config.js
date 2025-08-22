/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@qa-services/ui', '@qa-services/cms-core', '@qa-services/config'],
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Ignora errores TS en build
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Ignora ESLint en build
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
