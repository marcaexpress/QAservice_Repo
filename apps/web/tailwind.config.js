/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    
    // 🟩 IMPORTANTE: Incluir TODOS los paquetes del monorepo
    '../../packages/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/cms-core/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/config/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
  
  // 🟩 SAFELIST: Evitar que Tailwind purgue clases dinámicas
  safelist: [
    // Colores comunes
    { pattern: /^(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/ },
    // Tamaños comunes
    { pattern: /^(w|h)-\d+$/ },
    { pattern: /^grid-cols-\d+$/ },
    // Espaciado común
    { pattern: /^(p|m|px|py|mx|my)-\d+$/ },
    // Bordes y sombras
    { pattern: /^(rounded|shadow)-(sm|md|lg|xl|2xl|3xl)$/ },
  ],
};
