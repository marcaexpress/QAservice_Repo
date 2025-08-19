#!/usr/bin/env node

/**
 * 🚀 Script de Control de Despliegues a Vercel
 * Controla completamente el proceso de despliegue desde la línea de comandos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}${step}${colors.reset}`, 'bright');
  log(message);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Función para ejecutar comandos
function runCommand(command, description) {
  try {
    logInfo(`Ejecutando: ${command}`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    logSuccess(`${description} completado`);
    return result;
  } catch (error) {
    logError(`${description} falló: ${error.message}`);
    throw error;
  }
}

// Función para verificar si Vercel está configurado
function checkVercelConfig() {
  try {
    const vercelConfigPath = path.join(process.cwd(), '.vercel');
    if (fs.existsSync(vercelConfigPath)) {
      const config = JSON.parse(fs.readFileSync(path.join(vercelConfigPath, 'project.json'), 'utf8'));
      logSuccess(`Proyecto Vercel encontrado: ${config.name}`);
      return config;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Función para configurar el proyecto
function setupProject() {
  logStep('1️⃣', 'Configurando Proyecto Vercel');
  
  try {
    // Verificar si ya existe configuración
    const existingConfig = checkVercelConfig();
    if (existingConfig) {
      logWarning('El proyecto ya está configurado en Vercel');
      return existingConfig;
    }

    logInfo('Iniciando configuración del proyecto...');
    logInfo('Se abrirá el navegador para autenticación');
    
    // Ejecutar vercel link
    runCommand('vercel link', 'Vinculando proyecto con Vercel');
    
    logSuccess('Proyecto configurado exitosamente');
    return checkVercelConfig();
  } catch (error) {
    logError('Error configurando el proyecto');
    throw error;
  }
}

// Función para configurar variables de entorno
function setupEnvironmentVariables() {
  logStep('2️⃣', 'Configurando Variables de Entorno');
  
  try {
    // Leer variables desde vercel-env.example
    const envExamplePath = path.join(process.cwd(), 'vercel-env.example');
    if (!fs.existsSync(envExamplePath)) {
      logWarning('Archivo vercel-env.example no encontrado');
      return;
    }

    logInfo('Variables de entorno disponibles:');
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    const envLines = envContent.split('\n').filter(line => line.includes('=') && !line.startsWith('#'));
    
    envLines.forEach(line => {
      const [key] = line.split('=');
      logInfo(`  - ${key}`);
    });

    logInfo('Para configurar estas variables, usa:');
    logInfo('vercel env add NOMBRE_VARIABLE');
    logInfo('O configúralas desde el dashboard de Vercel');
    
  } catch (error) {
    logError('Error configurando variables de entorno');
    throw error;
  }
}

// Función para hacer deploy
function deployProject(environment = 'production') {
  logStep('3️⃣', `Desplegando a ${environment.toUpperCase()}`);
  
  try {
    if (environment === 'production') {
      runCommand('vercel --prod', 'Despliegue a producción');
    } else {
      runCommand('vercel', 'Despliegue de preview');
    }
    
    logSuccess(`Despliegue a ${environment} completado`);
  } catch (error) {
    logError(`Error en despliegue a ${environment}`);
    throw error;
  }
}

// Función para verificar el estado del proyecto
function checkProjectStatus() {
  logStep('4️⃣', 'Verificando Estado del Proyecto');
  
  try {
    const config = checkVercelConfig();
    if (!config) {
      logWarning('Proyecto no configurado');
      return;
    }

    logInfo(`Nombre del proyecto: ${config.name}`);
    logInfo(`ID del proyecto: ${config.projectId}`);
    logInfo(`ID de la organización: ${config.orgId}`);
    
    // Verificar deployments
    logInfo('Verificando deployments...');
    const deployments = runCommand('vercel ls', 'Listando deployments');
    logSuccess('Estado del proyecto verificado');
    
  } catch (error) {
    logError('Error verificando estado del proyecto');
    throw error;
  }
}

// Función para mostrar ayuda
function showHelp() {
  log('\n🚀 Script de Control de Despliegues a Vercel', 'bright');
  log('================================================\n');
  
  log('Comandos disponibles:', 'cyan');
  log('  setup     - Configurar proyecto Vercel');
  log('  env       - Configurar variables de entorno');
  log('  deploy    - Desplegar a producción');
  log('  preview   - Desplegar preview');
  log('  status    - Verificar estado del proyecto');
  log('  help      - Mostrar esta ayuda\n');
  
  log('Ejemplos:', 'yellow');
  log('  node deploy-vercel.js setup');
  log('  node deploy-vercel.js deploy');
  log('  node deploy-vercel.js status\n');
}

// Función principal
function main() {
  const command = process.argv[2] || 'help';
  
  try {
    switch (command) {
      case 'setup':
        setupProject();
        break;
      case 'env':
        setupEnvironmentVariables();
        break;
      case 'deploy':
        deployProject('production');
        break;
      case 'preview':
        deployProject('preview');
        break;
      case 'status':
        checkProjectStatus();
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logError('Error ejecutando comando');
    logError(error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  setupProject,
  setupEnvironmentVariables,
  deployProject,
  checkProjectStatus
};
