#!/bin/bash

echo "🚀 Iniciando build de Vercel..."

# Intentar generar Tailwind CSS
echo "📦 Generando Tailwind CSS..."
if tailwindcss -c apps/web/tailwind.config.js -i apps/web/app/globals.css -o apps/web/public/_tw.css --minify; then
    echo "✅ Tailwind CSS generado exitosamente"
else
    echo "⚠️ Tailwind CSS falló, creando archivo de respaldo..."
    # Crear un archivo CSS básico como respaldo
    cat > apps/web/public/_tw.css << 'EOF'
/* CSS de respaldo - Tailwind falló */
* { box-sizing: border-box; }
body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.bg-primary-50 { background-color: #eff6ff; }
.bg-primary-100 { background-color: #dbeafe; }
.bg-primary-600 { background-color: #2563eb; }
.text-primary-600 { color: #2563eb; }
.text-gray-900 { color: #111827; }
.text-gray-600 { color: #4b5563; }
.text-white { color: #ffffff; }
.section-padding { padding: 4rem 0; }
.container-custom { max-width: 80rem; margin: 0 auto; padding: 0 1rem; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gap-8 { gap: 2rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.max-w-4xl { max-width: 56rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.md\:text-6xl { font-size: 3.75rem; line-height: 1; }
.font-bold { font-weight: 700; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.leading-tight { line-height: 1.25; }
.leading-relaxed { line-height: 1.625; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.md\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
.space-y-20 > * + * { margin-top: 5rem; }
@media (min-width: 768px) { .section-padding { padding: 6rem 0; } }
@media (min-width: 640px) { .container-custom { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .container-custom { padding: 0 2rem; } }
EOF
    echo "✅ Archivo CSS de respaldo creado"
fi

# Continuar con el build de Next.js
echo "🔨 Iniciando build de Next.js..."
cd apps/web
npm run build

echo "🎉 Build completado!"
