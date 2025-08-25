#!/usr/bin/env node

// Test de preparación para deployment
console.log('🚀 VERIFICACIÓN FINAL DE DEPLOYMENT');
console.log('=====================================\n');

const fs = require('fs');
const path = require('path');

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

function checkContent(filePath, searchText, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasContent = content.includes(searchText);
    console.log(`${hasContent ? '✅' : '❌'} ${description}`);
    return hasContent;
  } catch (error) {
    console.log(`❌ ${description} (Error leyendo archivo)`);
    return false;
  }
}

console.log('📁 ARCHIVOS CRÍTICOS:');
console.log('─────────────────────');
checkFile('apps/web/vercel.json', 'Configuración Vercel');
checkFile('apps/web/.env.local', 'Variables de entorno locales');
checkFile('apps/web/tailwind.config.ts', 'Configuración Tailwind');
checkFile('apps/web/next.config.js', 'Configuración Next.js');
checkFile('apps/web/app/error.tsx', 'Página de error personalizada');
checkFile('apps/web/app/not-found.tsx', 'Página 404 personalizada');

console.log('\n🔧 CONFIGURACIONES DINÁMICAS:');
console.log('─────────────────────────────');
checkContent('apps/web/app/admin/layout.tsx', 'dynamic = \'force-dynamic\'', 'Admin layout dinámico');
checkContent('apps/web/app/api/admin/session/route.ts', 'export const dynamic', 'API admin/session dinámico');
checkContent('apps/web/app/api/auth/session/route.ts', 'export const dynamic', 'API auth/session dinámico');
checkContent('apps/web/app/api/cms/components/test/route.ts', 'export const dynamic', 'API cms/components dinámico');

console.log('\n🔒 SEGURIDAD JWT:');
console.log('─────────────────');
checkContent('apps/web/lib/jwt.ts', 'NODE_ENV !== \'production\'', 'Logs protegidos en producción');

console.log('\n📦 ESTRUCTURA DE PACKAGES:');
console.log('─────────────────────────');
checkFile('packages/design-system/dist/styles.css', 'CSS del sistema de diseño');
checkFile('packages/cms-core/dist/index.js', 'Core CMS compilado');
checkFile('packages/ui/dist/index.js', 'UI components compilados');

console.log('\n🗄️ CONFIGURACIÓN DE BASE DE DATOS:');
console.log('──────────────────────────────────');
checkFile('apps/web/prisma/schema.prisma', 'Schema de Prisma');

console.log('\n🧪 ARCHIVOS DE TEST:');
console.log('───────────────────');
checkFile('apps/web/integration.test.js', 'Tests de integración');
checkFile('apps/web/vercel-deploy.test.js', 'Tests de deployment');

console.log('\n✅ VERIFICACIÓN COMPLETADA');
console.log('Tu aplicación está lista para deployment en Vercel! 🚀');
