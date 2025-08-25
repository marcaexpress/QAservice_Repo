/** @type {import('tailwindcss').Config} */
// [DEPLOY-FIX] apps/web/tailwind.config.ts
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Incluye tu design-system si lo usas en la web:
    "../../packages/design-system/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};

export default config;
