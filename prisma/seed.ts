import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Crear organización por defecto
    const organization = await prisma.organization.upsert({
      where: { slug: 'qa-services' },
      update: {},
      create: {
        id: 'org_default',
        name: 'QA Services',
        slug: 'qa-services',
      },
    });
    console.log('✅ Organización creada:', organization.name);

    // Crear permisos básicos
    const permissions = await Promise.all([
      // Permisos de páginas
      prisma.permission.upsert({
        where: { action_resource: { action: 'create', resource: 'page' } },
        update: {},
        create: { action: 'create', resource: 'page' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'read', resource: 'page' } },
        update: {},
        create: { action: 'read', resource: 'page' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'update', resource: 'page' } },
        update: {},
        create: { action: 'update', resource: 'page' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'delete', resource: 'page' } },
        update: {},
        create: { action: 'delete', resource: 'page' },
      }),
      // Permisos de usuarios
      prisma.permission.upsert({
        where: { action_resource: { action: 'create', resource: 'user' } },
        update: {},
        create: { action: 'create', resource: 'user' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'read', resource: 'user' } },
        update: {},
        create: { action: 'read', resource: 'user' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'update', resource: 'user' } },
        update: {},
        create: { action: 'update', resource: 'user' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'delete', resource: 'user' } },
        update: {},
        create: { action: 'delete', resource: 'user' },
      }),
      // Permisos específicos del CMS
      prisma.permission.upsert({
        where: { action_resource: { action: 'manage', resource: 'theme' } },
        update: {},
        create: { action: 'manage', resource: 'theme' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'manage', resource: 'layout' } },
        update: {},
        create: { action: 'manage', resource: 'layout' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'manage', resource: 'content' } },
        update: {},
        create: { action: 'manage', resource: 'content' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'manage', resource: 'blocks' } },
        update: {},
        create: { action: 'manage', resource: 'blocks' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'publish', resource: 'content' } },
        update: {},
        create: { action: 'publish', resource: 'content' },
      }),
      prisma.permission.upsert({
        where: { action_resource: { action: 'preview', resource: 'content' } },
        update: {},
        create: { action: 'preview', resource: 'content' },
      }),
    ]);
    console.log('✅ Permisos creados:', permissions.length);

    // Crear rol de administrador
    const adminRole = await prisma.role.upsert({
      where: { id: 'role_admin' },
      update: {},
      create: {
        id: 'role_admin',
        name: 'Administrador',
        description: 'Rol con todos los permisos del sistema',
        organizationId: organization.id,
      },
    });
    console.log('✅ Rol de administrador creado:', adminRole.name);

    // Crear rol de Editor CMS
    const cmsEditorRole = await prisma.role.upsert({
      where: { id: 'role_cms_editor' },
      update: {},
      create: {
        id: 'role_cms_editor',
        name: 'Editor CMS',
        description: 'Rol para editar contenido, temas y layouts del sitio',
        organizationId: organization.id,
      },
    });
    console.log('✅ Rol de Editor CMS creado:', cmsEditorRole.name);

    // Crear rol de usuario básico
    const userRole = await prisma.role.upsert({
      where: { id: 'role_user' },
      update: {},
      create: {
        id: 'role_user',
        name: 'Usuario',
        description: 'Rol con permisos básicos de lectura',
        organizationId: organization.id,
      },
    });
    console.log('✅ Rol de usuario creado:', userRole.name);

    // Asignar todos los permisos al rol de administrador
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log('✅ Permisos asignados al rol de administrador');

    // Asignar permisos del CMS al rol de Editor CMS
    const cmsPermissions = permissions.filter(p => 
      p.resource === 'theme' || 
      p.resource === 'layout' || 
      p.resource === 'content' || 
      p.resource === 'blocks' ||
      (p.resource === 'page' && p.action !== 'delete') // Puede crear, leer y actualizar páginas pero no eliminarlas
    );
    
    for (const permission of cmsPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: cmsEditorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: cmsEditorRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log('✅ Permisos del CMS asignados al rol de Editor CMS');

    // Asignar permisos básicos al rol de usuario (solo lectura)
    const readPermissions = permissions.filter(p => p.action === 'read');
    for (const permission of readPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log('✅ Permisos básicos asignados al rol de usuario');

    // Hash de contraseñas
    const adminPassword = await bcrypt.hash('admin123', 12);
    const editorPassword = await bcrypt.hash('editor123', 12);

    // Crear usuario administrador de ejemplo
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@qaservices.com' },
      update: {},
      create: {
        email: 'admin@qaservices.com',
        name: 'Administrador QA Services',
        password: adminPassword,
        organizationId: organization.id,
      },
    });
    console.log('✅ Usuario administrador creado:', adminUser.email);

    // Crear usuario editor CMS de ejemplo
    const cmsEditorUser = await prisma.user.upsert({
      where: { email: 'editor@qaservices.com' },
      update: {},
      create: {
        email: 'editor@qaservices.com',
        name: 'Editor CMS QA Services',
        password: editorPassword,
        organizationId: organization.id,
      },
    });
    console.log('✅ Usuario editor CMS creado:', cmsEditorUser.email);

    // Asignar rol de administrador al usuario admin
    await prisma.roleAssignment.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });
    console.log('✅ Rol de administrador asignado al usuario admin');

    // Asignar rol de Editor CMS al usuario editor
    await prisma.roleAssignment.upsert({
      where: {
        userId_roleId: {
          userId: cmsEditorUser.id,
          roleId: cmsEditorRole.id,
        },
      },
      update: {},
      create: {
        userId: cmsEditorUser.id,
        roleId: cmsEditorRole.id,
      },
    });
    console.log('✅ Rol de Editor CMS asignado al usuario editor');

    console.log('🎉 Seed completado exitosamente!');
    console.log('📧 Usuario admin: admin@qaservices.com');
    console.log('🔑 Contraseña admin: admin123');
    console.log('📝 Usuario editor CMS: editor@qaservices.com');
    console.log('🔑 Contraseña editor: editor123');
    console.log('👤 Rol Usuario creado para nuevos registros');
    console.log('🎨 Rol Editor CMS creado para gestión del sitio');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
