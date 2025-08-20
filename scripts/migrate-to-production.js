#!/usr/bin/env node

/**
 * 🚀 Script de Migración de Datos - Desarrollo → Producción
 * Sincroniza la base de datos de desarrollo con Neon PostgreSQL
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configuración de entornos
const config = {
  development: {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/qa_services_dev',
    name: 'Desarrollo'
  },
  production: {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Producción (Neon)'
  }
};

// Clientes Prisma
const devClient = new PrismaClient({
  datasources: {
    db: {
      url: config.development.databaseUrl
    }
  }
});

const prodClient = new PrismaClient({
  datasources: {
    db: {
      url: config.production.databaseUrl
    }
  }
});

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

// Función para migrar datos
async function migrateData() {
  try {
    logStep('🚀', 'Iniciando Migración de Datos - Desarrollo → Producción');
    
    // 1. Verificar conexiones
    logStep('1️⃣', 'Verificando conexiones a bases de datos...');
    
    await devClient.$connect();
    logSuccess(`Conectado a ${config.development.name}`);
    
    await prodClient.$connect();
    logSuccess(`Conectado a ${config.production.name}`);
    
    // 2. Obtener datos de desarrollo
    logStep('2️⃣', 'Extrayendo datos de desarrollo...');
    
    const users = await devClient.user.findMany({
      include: {
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    });
    
    const organizations = await devClient.organization.findMany();
    const roles = await devClient.role.findMany();
    const permissions = await devClient.permission.findMany();
    const rolePermissions = await devClient.rolePermission.findMany();
    const roleAssignments = await devClient.roleAssignment.findMany();
    
    logSuccess(`Usuarios: ${users.length}`);
    logSuccess(`Organizaciones: ${organizations.length}`);
    logSuccess(`Roles: ${roles.length}`);
    logSuccess(`Permisos: ${permissions.length}`);
    logSuccess(`Asignaciones de roles: ${roleAssignments.length}`);
    
    // 3. Limpiar datos de producción (CUIDADO!)
    logStep('3️⃣', 'Limpiando datos de producción...');
    
    if (process.argv.includes('--force-clean')) {
      await prodClient.roleAssignment.deleteMany();
      await prodClient.rolePermission.deleteMany();
      await prodClient.role.deleteMany();
      await prodClient.permission.deleteMany();
      await prodClient.user.deleteMany();
      await prodClient.organization.deleteMany();
      logSuccess('Datos de producción limpiados');
    } else {
      logWarning('Saltando limpieza de producción (usar --force-clean para forzar)');
    }
    
    // 4. Migrar datos
    logStep('4️⃣', 'Migrando datos a producción...');
    
    // Organizaciones
    for (const org of organizations) {
      await prodClient.organization.create({
        data: {
          id: org.id,
          name: org.name,
          description: org.description,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt
        }
      });
    }
    logSuccess('Organizaciones migradas');
    
    // Permisos
    for (const perm of permissions) {
      await prodClient.permission.create({
        data: {
          id: perm.id,
          name: perm.name,
          description: perm.description,
          resource: perm.resource,
          action: perm.action,
          createdAt: perm.createdAt,
          updatedAt: perm.updatedAt
        }
      });
    }
    logSuccess('Permisos migrados');
    
    // Roles
    for (const role of roles) {
      await prodClient.role.create({
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          organizationId: role.organizationId,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt
        }
      });
    }
    logSuccess('Roles migrados');
    
    // Usuarios
    for (const user of users) {
      await prodClient.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password, // ¡CUIDADO! Contraseñas hasheadas
          organizationId: user.organizationId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }
    logSuccess('Usuarios migrados');
    
    // Asignaciones de roles
    for (const assignment of roleAssignments) {
      await prodClient.roleAssignment.create({
        data: {
          id: assignment.id,
          userId: assignment.userId,
          roleId: assignment.roleId,
          organizationId: assignment.organizationId,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt
        }
      });
    }
    logSuccess('Asignaciones de roles migradas');
    
    // Permisos de roles
    for (const rolePerm of rolePermissions) {
      await prodClient.rolePermission.create({
        data: {
          id: rolePerm.id,
          roleId: rolePerm.roleId,
          permissionId: rolePerm.permissionId,
          createdAt: rolePerm.createdAt,
          updatedAt: rolePerm.updatedAt
        }
      });
    }
    logSuccess('Permisos de roles migrados');
    
    // 5. Verificar migración
    logStep('5️⃣', 'Verificando migración...');
    
    const prodUsers = await prodClient.user.count();
    const prodOrgs = await prodClient.organization.count();
    const prodRoles = await prodClient.role.count();
    
    logSuccess(`Verificación completada:`);
    logInfo(`  - Usuarios en producción: ${prodUsers}`);
    logInfo(`  - Organizaciones en producción: ${prodOrgs}`);
    logInfo(`  - Roles en producción: ${prodRoles}`);
    
    logStep('🎉', 'Migración completada exitosamente!');
    
  } catch (error) {
    logError('Error durante la migración:');
    logError(error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await devClient.$disconnect();
    await prodClient.$disconnect();
  }
}

// Función para mostrar ayuda
function showHelp() {
  log('\n🚀 Script de Migración de Datos - QA Services', 'bright');
  log('================================================\n');
  
  log('Uso:', 'cyan');
  log('  node scripts/migrate-to-production.js [opciones]\n');
  
  log('Opciones:', 'yellow');
  log('  --force-clean    Limpia datos de producción antes de migrar');
  log('  --help           Muestra esta ayuda\n');
  
  log('Ejemplos:', 'blue');
  log('  node scripts/migrate-to-production.js');
  log('  node scripts/migrate-to-production.js --force-clean\n');
  
  log('⚠️  ADVERTENCIAS:', 'red');
  log('  - Este script sobrescribe datos de producción');
  log('  - Usar --force-clean solo si estás seguro');
  log('  - Hacer backup antes de ejecutar\n');
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    showHelp();
    return;
  }
  
  // Verificar variables de entorno
  if (!process.env.DATABASE_URL) {
    logError('DATABASE_URL no está configurada');
    logInfo('Configura las variables de entorno antes de ejecutar');
    process.exit(1);
  }
  
  migrateData();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  migrateData,
  showHelp
};
