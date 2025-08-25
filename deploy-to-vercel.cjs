#!/usr/bin/env node

// Script de deployment automatizado para Vercel
console.log('🚀 INICIANDO DEPLOYMENT A VERCEL');
console.log('=================================\n');

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function runCommand(command, description) {
  console.log(`⏳ ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });
    if (stderr && !stderr.includes('Update available')) {
      console.log(`⚠️ Warnings: ${stderr}`);
    }
    console.log(`✅ ${description} completado\n`);
    return true;
  } catch (error) {
    console.log(`❌ Error en ${description}:`);
    console.log(error.message);
    return false;
  }
}

async function deployToVercel() {
  console.log('📋 PASOS DE DEPLOYMENT:');
  console.log('1. Limpiar cache');
  console.log('2. Ejecutar tests');
  console.log('3. Build de producción');
  console.log('4. Desplegar a Vercel\n');

  // Paso 1: Limpiar cache
  const cleanSuccess = await runCommand('npm run clean', 'Limpiando cache');
  if (!cleanSuccess) {
    console.log('⚠️ Continuando sin limpiar cache...\n');
  }

  // Paso 2: Ejecutar tests
  const testSuccess = await runCommand('npm test', 'Ejecutando tests');
  if (!testSuccess) {
    console.log('❌ Los tests fallaron. Abortando deployment.');
    process.exit(1);
  }

  // Paso 3: Build de producción
  const buildSuccess = await runCommand('npm run build', 'Build de producción');
  if (!buildSuccess) {
    console.log('❌ El build falló. Abortando deployment.');
    process.exit(1);
  }

  // Paso 4: Desplegar a Vercel
  console.log('🚀 LISTOS PARA VERCEL!');
  console.log('===========================');
  console.log('');
  console.log('Para desplegar a Vercel, ejecuta:');
  console.log('');
  console.log('📋 OPCIÓN 1 - Deployment automático:');
  console.log('   cd apps/web');
  console.log('   vercel --prod');
  console.log('');
  console.log('📋 OPCIÓN 2 - Deployment desde GitHub:');
  console.log('   1. git add .');
  console.log('   2. git commit -m "Deploy: Todas las correcciones aplicadas"');
  console.log('   3. git push origin main');
  console.log('   4. Vercel detectará automáticamente el push');
  console.log('');
  console.log('✅ APLICACIÓN LISTA PARA PRODUCCIÓN!');
  console.log('🔗 URL esperada: https://qa-services-d849kxe3s-marcaexpress-projects.vercel.app');
}

deployToVercel().catch(console.error);
