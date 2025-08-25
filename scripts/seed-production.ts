const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const initialData = {
  organizations: [
    { id: 'org_qa_services', name: 'QA Services' }
  ],
  permissions: [
    { id: 'perm_user_create', action: 'create', resource: 'user' },
    { id: 'perm_user_read', action: 'read', resource: 'user' },
    { id: 'perm_user_update', action: 'update', resource: 'user' },
    { id: 'perm_user_delete', action: 'delete', resource: 'user' },
    { id: 'perm_org_create', action: 'create', resource: 'organization' },
    { id: 'perm_org_read', action: 'read', resource: 'organization' },
    { id: 'perm_org_update', action: 'update', resource: 'organization' },
    { id: 'perm_org_delete', action: 'delete', resource: 'organization' },
    { id: 'perm_cms_create', action: 'create', resource: 'cms' },
    { id: 'perm_cms_read', action: 'read', resource: 'cms' },
    { id: 'perm_cms_update', action: 'update', resource: 'cms' },
    { id: 'perm_cms_delete', action: 'delete', resource: 'cms' },
    { id: 'perm_cms_publish', action: 'publish', resource: 'cms' },
    { id: 'perm_admin_access', action: 'access', resource: 'admin' },
    { id: 'perm_system_config', action: 'configure', resource: 'system' }
  ],
  roles: [
    { id: 'role_super_admin', name: 'Super Admin', description: 'Acceso total', organizationId: 'org_qa_services' },
    { id: 'role_admin', name: 'Admin', description: 'Administrador de la organización', organizationId: 'org_qa_services' },
    { id: 'role_editor', name: 'Editor', description: 'Editor de contenido', organizationId: 'org_qa_services' },
    { id: 'role_viewer', name: 'Viewer', description: 'Visualizador', organizationId: 'org_qa_services' }
  ],
  users: [
    { id: 'user_super_admin', email: 'super@qaservices.com', name: 'Super Admin', password: 'super123', organizationId: 'org_qa_services' },
    { id: 'user_admin', email: 'admin@qaservices.com', name: 'Administrador', password: 'admin123', organizationId: 'org_qa_services' },
    { id: 'user_editor', email: 'editor@qaservices.com', name: 'Editor CMS', password: 'editor123', organizationId: 'org_qa_services' },
    { id: 'user_viewer', email: 'viewer@qaservices.com', name: 'Visualizador', password: 'viewer123', organizationId: 'org_qa_services' }
  ]
};

async function seedProduction() {
  console.log('🌱 Iniciando Seed de Producción - QA Services');

  // Organizaciones
  for (const org of initialData.organizations) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: { name: org.name },
      create: { id: org.id, name: org.name }
    });
  }

  // Permisos
  for (const perm of initialData.permissions) {
    await prisma.permission.upsert({
      where: { id: perm.id },
      update: { action: perm.action, resource: perm.resource },
      create: { id: perm.id, action: perm.action, resource: perm.resource }
    });
  }

  // Roles
  for (const role of initialData.roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name, description: role.description, organizationId: role.organizationId },
      create: { id: role.id, name: role.name, description: role.description, organizationId: role.organizationId }
    });
  }

  // Usuarios
  for (const user of initialData.users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email, name: user.name, password: hashedPassword, organizationId: user.organizationId },
      create: { id: user.id, email: user.email, name: user.name, password: hashedPassword, organizationId: user.organizationId }
    });
  }

  // Asignar permisos a roles (idempotente)
  for (const perm of initialData.permissions) {
    const existing = await prisma.rolePermission.findFirst({
      where: { roleId: 'role_super_admin', permissionId: perm.id }
    });
    if (!existing) {
      await prisma.rolePermission.create({ data: { roleId: 'role_super_admin', permissionId: perm.id } });
    }
  }
  const adminPermissions = [
    'perm_user_create', 'perm_user_read', 'perm_user_update',
    'perm_org_read', 'perm_org_update',
    'perm_cms_create', 'perm_cms_read', 'perm_cms_update', 'perm_cms_delete', 'perm_cms_publish',
    'perm_admin_access'
  ];
  for (const permId of adminPermissions) {
    const existing = await prisma.rolePermission.findFirst({
      where: { roleId: 'role_admin', permissionId: permId }
    });
    if (!existing) {
      await prisma.rolePermission.create({ data: { roleId: 'role_admin', permissionId: permId } });
    }
  }
  const editorPermissions = [
    'perm_cms_create', 'perm_cms_read', 'perm_cms_update', 'perm_cms_delete'
  ];
  for (const permId of editorPermissions) {
    const existing = await prisma.rolePermission.findFirst({
      where: { roleId: 'role_editor', permissionId: permId }
    });
    if (!existing) {
      await prisma.rolePermission.create({ data: { roleId: 'role_editor', permissionId: permId } });
    }
  }
  const viewerPermissionId = 'perm_cms_read';
  const viewerExisting = await prisma.rolePermission.findFirst({
    where: { roleId: 'role_viewer', permissionId: viewerPermissionId }
  });
  if (!viewerExisting) {
    await prisma.rolePermission.create({ data: { roleId: 'role_viewer', permissionId: viewerPermissionId } });
  }

  // Asignar roles a usuarios (idempotente)
  const roleAssignments = [
    { userId: 'user_super_admin', roleId: 'role_super_admin' },
    { userId: 'user_admin', roleId: 'role_admin' },
    { userId: 'user_editor', roleId: 'role_editor' },
    { userId: 'user_viewer', roleId: 'role_viewer' }
  ];
  for (const ra of roleAssignments) {
    const existing = await prisma.roleAssignment.findFirst({
      where: { userId: ra.userId, roleId: ra.roleId }
    });
    if (!existing) {
      await prisma.roleAssignment.create({ data: ra });
    }
  }

  console.log('✅ Seed de producción completado');
}

seedProduction()
  .catch(e => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
