const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAdminRoles() {
  try {
    console.log('🔍 Verificando roles del usuario admin...');
    
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@qaservices.com' },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    
    if (!adminUser) {
      console.log('❌ Usuario admin no encontrado');
      return;
    }
    
    console.log('✅ Usuario admin encontrado:', adminUser.email);
    console.log('📋 Roles actuales:', adminUser.roles.map(r => r.role.name));
    
    // Buscar rol de administrador
    const adminRole = await prisma.role.findFirst({
      where: { name: 'Administrador' }
    });
    
    if (!adminRole) {
      console.log('❌ Rol de administrador no encontrado');
      return;
    }
    
    console.log('✅ Rol de administrador encontrado:', adminRole.name);
    
    // Verificar si ya tiene el rol asignado
    const hasAdminRole = adminUser.roles.some(r => r.role.name === 'Administrador');
    
    if (hasAdminRole) {
      console.log('✅ Usuario admin ya tiene el rol de administrador');
    } else {
      console.log('➕ Asignando rol de administrador...');
      
      await prisma.roleAssignment.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id
        }
      });
      
      console.log('✅ Rol de administrador asignado exitosamente');
    }
    
    // Verificar roles finales
    const updatedUser = await prisma.user.findFirst({
      where: { email: 'admin@qaservices.com' },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    
    console.log('🎯 Roles finales del usuario admin:', updatedUser.roles.map(r => r.role.name));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRoles();
