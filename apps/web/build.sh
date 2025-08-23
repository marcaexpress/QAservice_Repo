#!/bin/bash

echo "🚀 Iniciando build de producción..."

# Asegurar que las dependencias estén instaladas
echo "📦 Instalando dependencias..."
npm install

# Generar CSS de Tailwind ANTES del build
echo "🎨 Generando CSS de Tailwind..."
npm run prebuild

# Verificar que el CSS se generó
if [ -f "public/_tw.css" ]; then
    echo "✅ CSS generado correctamente: $(ls -lh public/_tw.css)"
else
    echo "❌ Error: CSS no se generó"
    exit 1
fi

# Generar cliente de Prisma
echo "🗄️ Generando cliente de Prisma..."
npx prisma generate --schema=../../prisma/schema.prisma

# Build de Next.js
echo "🏗️ Construyendo aplicación..."
npm run build

echo "🎉 Build completado exitosamente!"
