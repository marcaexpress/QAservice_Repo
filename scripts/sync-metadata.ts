const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Carpeta donde están los metadatos JSON
const METADATA_DIR = path.join(__dirname, '../metadata');

async function syncMetadata() {
  console.log('🔄 Sincronizando metadatos desde JSON...');
  if (!fs.existsSync(METADATA_DIR)) {
    console.log('⚠️ No existe la carpeta de metadatos:', METADATA_DIR);
    return;
  }
  const files = fs.readdirSync(METADATA_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(METADATA_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📦 Procesando ${file}...`);
    // Sincronizar componentes
    if (data.type === 'component' && data.name) {
      const component = await prisma.component.upsert({
        where: { name: data.name },
        update: {
          category: data.category,
          description: data.description,
          isActive: data.isActive,
          organizationId: data.organizationId
        },
        create: {
          name: data.name,
          type: 'layout',
          category: data.category,
          description: data.description,
          isActive: data.isActive,
          organizationId: data.organizationId
        }
      });
      // Sincronizar propiedades del componente
      if (Array.isArray(data.properties)) {
        for (const prop of data.properties) {
          // Buscar si existe una propiedad con ese nombre y componentId
          const existing = await prisma.componentProperty.findFirst({
            where: { name: prop.name, componentId: component.id }
          });
          if (existing) {
            await prisma.componentProperty.update({
              where: { id: existing.id },
              data: { ...prop }
            });
          } else {
            await prisma.componentProperty.create({
              data: { ...prop, componentId: component.id }
            });
          }
        }
      }
      console.log(`✅ Sincronizado componente: ${data.name}`);
    }
    // Sincronizar páginas
    if (data.type === 'page' && data.slug) {
      await prisma.page.upsert({
        where: { slug: data.slug },
        update: {
          title: data.title,
          description: data.description,
          status: data.status,
          published: data.published,
          blocks: data.blocks,
          organizationId: data.organizationId
        },
        create: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: data.status,
          published: data.published,
          blocks: data.blocks,
          organizationId: data.organizationId,
          createdBy: 'system',
          updatedBy: 'system'
        }
      });
      console.log(`✅ Sincronizada página: ${data.slug}`);
    }
  }
  console.log('🎉 Sincronización de metadatos completada!');
}

syncMetadata()
  .catch(e => {
    console.error('❌ Error sincronizando metadatos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
