const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando base de datos...');
    
    // Verificar organizaciones
    const orgs = await prisma.organization.findMany();
    console.log('📋 Organizaciones:', orgs.length);
    
    // Verificar usuarios
    const users = await prisma.user.findMany();
    console.log('👥 Usuarios:', users.length);
    
    // Verificar páginas
    const pages = await prisma.page.findMany();
    console.log('📄 Páginas:', pages.length);
    
    // Si no hay páginas, crear algunas de ejemplo
    if (pages.length === 0) {
      console.log('➕ Creando páginas de ejemplo...');
      
      // Obtener la primera organización
      let org = orgs[0];
      if (!org) {
        console.log('❌ No hay organizaciones. Creando una...');
        const newOrg = await prisma.organization.create({
          data: {
            name: 'QA Services',
            description: 'Organización principal'
          }
        });
        org = newOrg;
      }
      
      // Obtener el primer usuario
      let user = users[0];
      if (!user) {
        console.log('❌ No hay usuarios. Creando uno...');
        const newUser = await prisma.user.create({
          data: {
            email: 'admin@qaservices.com',
            name: 'Administrador',
            organizationId: org.id
          }
        });
        user = newUser;
      }
      
      // Crear páginas de ejemplo
      const examplePages = [
        {
          title: 'Página de Inicio',
          slug: 'inicio',
          description: 'Página principal del sitio',
          status: 'PUBLISHED',
          published: true,
          blocks: [
            {
              type: 'hero',
              content: {
                title: 'Bienvenido a QA Services',
                subtitle: 'Consultoría en Testing de Software'
              }
            }
          ],
          createdBy: user.id,
          updatedBy: user.id,
          organizationId: org.id
        },
        {
          title: 'Servicios',
          slug: 'servicios',
          description: 'Nuestros servicios de QA',
          status: 'PUBLISHED',
          published: true,
          blocks: [
            {
              type: 'services',
              content: {
                title: 'Servicios de QA',
                services: [
                  { name: 'Testing Manual', description: 'Pruebas manuales exhaustivas' },
                  { name: 'Testing Automatizado', description: 'Automatización de pruebas' }
                ]
              }
            }
          ],
          createdBy: user.id,
          updatedBy: user.id,
          organizationId: org.id
        }
      ];
      
      for (const pageData of examplePages) {
        const page = await prisma.page.create({
          data: pageData
        });
        console.log('✅ Página creada:', page.title);
      }
      
      console.log('🎉 Páginas de ejemplo creadas exitosamente');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
