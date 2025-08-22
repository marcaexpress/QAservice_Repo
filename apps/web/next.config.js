/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // ⬇️ Monorepo: importar código fuera del dir del app
  experimental: { externalDir: true },

  // ⬇️ Evitar caché agresivo del fallback CSS en producción
  async headers() {
    return [
      {
        source: '/_tw.css',
        headers: [
          { key: 'Cache-Control', value: 'no-store' }, // siempre fresco
        ],
      },
    ];
  },
};

module.exports = nextConfig;
