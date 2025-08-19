/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@qa-services/ui', '@qa-services/cms-core', '@qa-services/config'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
