#!/bin/bash

echo "🚀 Iniciando build de Vercel..."

# Forzar compilación de Tailwind CSS
echo "📦 Compilando Tailwind CSS..."
cd apps/web

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Generar Tailwind CSS
echo "🎨 Generando Tailwind CSS..."
npx tailwindcss -i ./app/globals.css -o ./public/_tw.css --minify

# Verificar que se generó
if [ -f "./public/_tw.css" ]; then
    echo "✅ Tailwind CSS generado exitosamente"
    ls -la ./public/_tw.css
else
    echo "❌ ERROR: Tailwind CSS no se generó"
    exit 1
fi

# Continuar con el build de Next.js
echo "🔨 Iniciando build de Next.js..."
npm run build

echo "🎉 Build completado!"
