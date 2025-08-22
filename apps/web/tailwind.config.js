// apps/web/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // ⬇️ Ajusta estas rutas si usas paquetes compartidos
    '../../packages/**/*.{js,ts,jsx,tsx,mdx}',
    '../../libs/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Colores frecuentes
    { pattern: /^(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/ },
    // Spacing y radios comunes
    { pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-\d+$/ },
    { pattern: /^rounded(-[a-z0-9]+)?$/ },
    // Tamaños/grid comunes
    { pattern: /^(w|h)-\d+$/ },
    { pattern: /^grid-cols-\d+$/ },
    { pattern: /^col-span-\d+$/ },
    // Alineación
    { pattern: /^(justify|items|content)-(start|center|end|between|around|evenly)$/ },
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
