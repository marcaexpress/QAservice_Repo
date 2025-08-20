#!/usr/bin/env node

/**
 * 🌱 Script de Seed para Producción - QA Services
 * Pobla la base de datos de producción con datos iniciales
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Cliente Prisma para producción
const prisma = new PrismaClient();

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

// Datos iniciales para producción
const initialData = {
  organizations: [
    {
      id: 'org_qa_services',
      name: 'QA Services',
      slug: 'qa-services'
    }
  ],
  
  permissions: [
    // Usuarios
    { id: 'perm_user_create', action: 'create', resource: 'user' },
    { id: 'perm_user_read', action: 'read', resource: 'user' },
    { id: 'perm_user_update', action: 'update', resource: 'user' },
    { id: 'perm_user_delete', action: 'delete', resource: 'user' },
    
    // Organizaciones
    { id: 'perm_org_create', action: 'create', resource: 'organization' },
    { id: 'perm_org_read', action: 'read', resource: 'organization' },
    { id: 'perm_org_update', action: 'update', resource: 'organization' },
    { id: 'perm_org_delete', action: 'delete', resource: 'organization' },
    
    // CMS
    { id: 'perm_cms_create', action: 'create', resource: 'cms' },
    { id: 'perm_cms_read', action: 'read', resource: 'cms' },
    { id: 'perm_cms_update', action: 'update', resource: 'cms' },
    { id: 'perm_cms_delete', action: 'delete', resource: 'cms' },
    { id: 'perm_cms_publish', action: 'publish', resource: 'cms' },
    
    // Administración
    { id: 'perm_admin_access', action: 'access', resource: 'admin' },
    { id: 'perm_system_config', action: 'configure', resource: 'system' }
  ],
  
  roles: [
    {
      id: 'role_super_admin',
      name: 'Super Administrador',
      description: 'Acceso completo al sistema',
      organizationId: 'org_qa_services'
    },
    {
      id: 'role_admin',
      name: 'Administrador',
      description: 'Administrador de la organización',
      organizationId: 'org_qa_services'
    },
    {
      id: 'role_editor',
      name: 'Editor CMS',
      description: 'Editor de contenido del CMS',
      organizationId: 'org_qa_services'
    },
    {
      id: 'role_viewer',
      name: 'Visualizador',
      description: 'Solo puede ver contenido',
      organizationId: 'org_qa_services'
    }
  ],
  
  users: [
    {
      id: 'user_super_admin',
      email: 'superadmin@qaservices.com',
      name: 'Super Administrador',
      password: 'superadmin123', // Se hasheará
      organizationId: 'org_qa_services'
    },
    {
      id: 'user_admin',
      email: 'admin@qaservices.com',
      name: 'Administrador',
      password: 'admin123', // Se hasheará
      organizationId: 'org_qa_services'
    },
    {
      id: 'user_editor',
      email: 'editor@qaservices.com',
      name: 'Editor CMS',
      password: 'editor123', // Se hasheará
      organizationId: 'org_qa_services'
    },
    {
      id: 'user_viewer',
      email: 'viewer@qaservices.com',
      name: 'Visualizador',
      password: 'viewer123', // Se hasheará
      organizationId: 'org_qa_services'
    }
  ]
};

// Función para poblar la base de datos
async function seedProduction() {
  try {
    logStep('🌱', 'Iniciando Seed de Producción - QA Services');
    
    // 1. Verificar conexión
    logStep('1️⃣', 'Verificando conexión a producción...');
    await prisma.$connect();
    logSuccess('Conectado a base de datos de producción');
    
    // 2. Limpiar datos existentes (CUIDADO!)
    logStep('2️⃣', 'Limpiando datos existentes...');
    
    if (process.argv.includes('--force-clean')) {
      await prisma.roleAssignment.deleteMany();
      await prisma.rolePermission.deleteMany();
      await prisma.role.deleteMany();
      await prisma.permission.deleteMany();
      await prisma.user.deleteMany();
      await prisma.organization.deleteMany();
      logSuccess('Datos existentes limpiados');
    } else {
      logWarning('Saltando limpieza (usar --force-clean para forzar)');
    }
    
    // 3. Crear organizaciones
    logStep('3️⃣', 'Creando organizaciones...');
    for (const org of initialData.organizations) {
      await prisma.organization.create({
        data: {
          id: org.id,
          name: org.name,
          slug: org.slug
        }
      });
    }
    logSuccess('Organizaciones creadas');
    
    // 4. Crear permisos
    logStep('4️⃣', 'Creando permisos...');
    for (const perm of initialData.permissions) {
      await prisma.permission.create({
        data: {
          id: perm.id,
          action: perm.action,
          resource: perm.resource
        }
      });
    }
    logSuccess('Permisos creados');
    
    // 5. Crear roles
    logStep('5️⃣', 'Creando roles...');
    for (const role of initialData.roles) {
      await prisma.role.create({
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          organizationId: role.organizationId
        }
      });
    }
    logSuccess('Roles creados');
    
    // 6. Crear usuarios
    logStep('6️⃣', 'Creando usuarios...');
    for (const user of initialData.users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: hashedPassword,
          organizationId: user.organizationId
        }
      });
    }
    logSuccess('Usuarios creados');
    
    // 7. Asignar permisos a roles
    logStep('7️⃣', 'Asignando permisos a roles...');
    
    // Super Admin - Todos los permisos
    for (const perm of initialData.permissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: 'role_super_admin',
          permissionId: perm.id
        }
      });
    }
    
    // Admin - Permisos de administración
    const adminPermissions = [
      'perm_user_create', 'perm_user_read', 'perm_user_update',
      'perm_org_read', 'perm_org_update',
      'perm_cms_create', 'perm_cms_read', 'perm_cms_update', 'perm_cms_delete', 'perm_cms_publish',
      'perm_admin_access'
    ];
    
    for (const permId of adminPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: 'role_admin',
          permissionId: permId
        }
      });
    }
    
    // Editor - Permisos de CMS
    const editorPermissions = [
      'perm_cms_create', 'perm_cms_read', 'perm_cms_update', 'perm_cms_delete'
    ];
    
    for (const permId of editorPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: 'role_editor',
          permissionId: permId
        }
      });
    }
    
    // Viewer - Solo lectura
    await prisma.rolePermission.create({
      data: {
        roleId: 'role_viewer',
        permissionId: 'perm_cms_read'
      }
    });
    
    logSuccess('Permisos asignados a roles');
    
    // 8. Asignar roles a usuarios
    logStep('8️⃣', 'Asignando roles a usuarios...');
    
    await prisma.roleAssignment.create({
      data: {
        userId: 'user_super_admin',
        roleId: 'role_super_admin'
      }
    });
    
    await prisma.roleAssignment.create({
      data: {
        userId: 'user_admin',
        roleId: 'role_admin'
      }
    });
    
    await prisma.roleAssignment.create({
      data: {
        userId: 'user_editor',
        roleId: 'role_editor'
      }
    });
    
    await prisma.roleAssignment.create({
      data: {
        userId: 'user_viewer',
        roleId: 'role_viewer'
      }
    });
    
    logSuccess('Roles asignados a usuarios');
    
    // 9. Verificar seed
    logStep('9️⃣', 'Verificando seed...');
    
    const userCount = await prisma.user.count();
    const orgCount = await prisma.organization.count();
    const roleCount = await prisma.role.count();
    const permCount = await prisma.permission.count();
    
    logSuccess('Seed completado exitosamente:');
    logInfo(`  - Usuarios: ${userCount}`);
    logInfo(`  - Organizaciones: ${orgCount}`);
    logInfo(`  - Roles: ${roleCount}`);
    logInfo(`  - Permisos: ${permCount}`);
    
    logStep('🎉', 'Base de datos de producción poblada correctamente!');
    
    // 10. Mostrar credenciales de acceso
    logStep('🔑', 'Credenciales de Acceso:');
    logInfo('Super Admin: superadmin@qaservices.com / superadmin123');
    logInfo('Admin: admin@qaservices.com / admin123');
    logInfo('Editor: editor@qaservices.com / editor123');
    logInfo('Viewer: viewer@qaservices.com / viewer123');
    
  } catch (error) {
    logError('Error durante el seed:');
    logError(error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar ayuda
function showHelp() {
  log('\n🌱 Script de Seed para Producción - QA Services', 'bright');
  log('================================================\n');
  
  log('Uso:', 'cyan');
  log('  node scripts/seed-production.js [opciones]\n');
  
  log('Opciones:', 'yellow');
  log('  --force-clean    Limpia datos existentes antes del seed');
  log('  --help           Muestra esta ayuda\n');
  
  log('Ejemplos:', 'blue');
  log('  node scripts/seed-production.js');
  log('  node scripts/seed-production.js --force-clean\n');
  
  log('⚠️  ADVERTENCIAS:', 'red');
  log('  - Este script sobrescribe datos de producción');
  log('  - Usar --force-clean solo si estás seguro');
  log('  - Hacer backup antes de ejecutar\n');
  
  log('📋 Lo que se crea:', 'green');
  log('  - Organización: QA Services');
  log('  - Roles: Super Admin, Admin, Editor, Viewer');
  log('  - Usuarios con contraseñas hasheadas');
  log('  - Permisos completos del sistema');
  log('  - Asignaciones de roles y permisos');
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
  
  seedProduction();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  seedProduction,
  showHelp
};
