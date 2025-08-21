import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear organización
  const organization = await prisma.organization.upsert({
    where: { id: 'org_qa_services' },
    update: {},
    create: {
      id: 'org_qa_services',
      name: 'QA Services',
      description: 'Organización principal de QA Services'
    }
  });

  console.log('✅ Organización creada:', organization.name);

  // Crear roles
  const adminRole = await prisma.role.upsert({
    where: { id: 'role_admin' },
    update: {},
    create: {
      id: 'role_admin',
      name: 'Administrador',
      description: 'Rol de administrador con acceso completo',
      organizationId: organization.id
    }
  });

  const editorRole = await prisma.role.upsert({
    where: { id: 'role_editor_cms' },
    update: {},
    create: {
      id: 'role_editor_cms',
      name: 'Editor CMS',
      description: 'Editor de contenido del CMS',
      organizationId: organization.id
    }
  });

  const viewerRole = await prisma.role.upsert({
    where: { id: 'role_viewer' },
    update: {},
    create: {
      id: 'role_viewer',
      name: 'Visualizador',
      description: 'Solo puede ver contenido',
      organizationId: organization.id
    }
  });

  console.log('✅ Roles creados:', [adminRole.name, editorRole.name, viewerRole.name]);

  // Crear usuarios
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@qaservices.com' },
    update: {},
    create: {
      id: 'user_admin',
      email: 'admin@qaservices.com',
      name: 'Administrador QA Services',
      organizationId: organization.id
    }
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@qaservices.com' },
    update: {},
    create: {
      id: 'user_editor',
      email: 'editor@qaservices.com',
      name: 'Editor CMS',
      organizationId: organization.id
    }
  });

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@qaservices.com' },
    update: {},
    create: {
      id: 'user_viewer',
      email: 'viewer@qaservices.com',
      name: 'Visualizador',
      organizationId: organization.id
    }
  });

  console.log('✅ Usuarios creados:', [adminUser.name, editorUser.name, viewerUser.name]);

  // Asignar roles a usuarios
  await prisma.roleAssignment.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    }
  });

  await prisma.roleAssignment.upsert({
    where: { userId_roleId: { userId: editorUser.id, roleId: editorRole.id } },
    update: {},
    create: {
      userId: editorUser.id,
      roleId: editorRole.id
    }
  });

  await prisma.roleAssignment.upsert({
    where: { userId_roleId: { userId: viewerUser.id, roleId: viewerRole.id } },
    update: {},
    create: {
      userId: viewerUser.id,
      roleId: viewerRole.id
    }
  });

  console.log('✅ Roles asignados a usuarios');

  // Crear página de ejemplo
  const examplePage = await prisma.page.upsert({
    where: { slug: 'pagina-ejemplo' },
    update: {},
    create: {
      id: 'page_example',
      title: 'Página de Ejemplo',
      slug: 'pagina-ejemplo',
      description: 'Página de ejemplo para probar el control de acceso',
      status: 'DRAFT',
      published: false,
      blocks: [],
      createdBy: editorUser.id,
      updatedBy: editorUser.id,
      organizationId: organization.id
    }
  });

  console.log('✅ Página de ejemplo creada:', examplePage.title);

  // Crear páginas adicionales para testing
  const additionalPages = await Promise.all([
    prisma.page.upsert({
      where: { slug: 'servicios' },
      update: {},
      create: {
        id: 'page_services',
        title: 'Nuestros Servicios',
        slug: 'servicios',
        description: 'Página de servicios de QA',
        status: 'PUBLISHED',
        published: true,
        blocks: [],
        createdBy: editorUser.id,
        updatedBy: editorUser.id,
        organizationId: organization.id
      }
    }),
    prisma.page.upsert({
      where: { slug: 'contacto' },
      update: {},
      create: {
        id: 'page_contact',
        title: 'Contacto',
        slug: 'contacto',
        description: 'Página de contacto',
        status: 'REVIEW',
        published: false,
        blocks: [],
        createdBy: editorUser.id,
        updatedBy: editorUser.id,
        organizationId: organization.id
      }
    }),
    prisma.page.upsert({
      where: { slug: 'sobre-nosotros' },
      update: {},
      create: {
        id: 'page_about',
        title: 'Sobre Nosotros',
        slug: 'sobre-nosotros',
        description: 'Página sobre la empresa',
        status: 'DRAFT',
        published: false,
        blocks: [],
        createdBy: editorUser.id,
        updatedBy: editorUser.id,
        organizationId: organization.id
      }
    })
  ]);

  console.log('✅ Páginas adicionales creadas:', additionalPages.map(p => p.title));

  // Crear reglas de acceso de ejemplo
  const publicRule = await prisma.pageAccessRule.upsert({
    where: { id: 'rule_public' },
    update: {},
    create: {
      id: 'rule_public',
      pageId: examplePage.id,
      accessType: 'PUBLIC',
      permissions: ['VIEW']
    }
  });

  const roleBasedRule = await prisma.pageAccessRule.upsert({
    where: { id: 'rule_role_based' },
    update: {},
    create: {
      id: 'rule_role_based',
      pageId: examplePage.id,
      accessType: 'ROLE_BASED',
      roleId: editorRole.id,
      permissions: ['VIEW', 'EDIT', 'PUBLISH']
    }
  });

  const userSpecificRule = await prisma.pageAccessRule.upsert({
    where: { id: 'rule_user_specific' },
    update: {},
    create: {
      id: 'rule_user_specific',
      pageId: examplePage.id,
      accessType: 'USER_SPECIFIC',
      userId: adminUser.id,
      permissions: ['VIEW', 'EDIT', 'PUBLISH', 'DELETE']
    }
  });

  console.log('✅ Reglas de acceso creadas:', [
    'Pública',
    'Basada en Rol (Editor CMS)',
    'Usuario Específico (Admin)'
  ]);

  // Crear componentes predefinidos
  console.log('🔧 Creando componentes predefinidos...');
  
  const components = await Promise.all([
            // HEADER - Componente de navegación principal
        prisma.component.upsert({
          where: { name: 'layout_header' },
          update: {},
          create: {
            name: 'layout_header',
            type: 'layout',
            category: 'navigation',
            description: 'Header principal con logo y menú de navegación',
            isActive: true,
            organizationId: organization.id,
            properties: {
              create: [
                { name: 'siteName', type: 'string', value: 'Mi Sitio Web', required: true, order: 1 },
                { name: 'logo', type: 'image', required: false, order: 2 },
                { name: 'menuItems', type: 'array', required: false, order: 3 },
                { name: 'backgroundColor', type: 'color', value: '#ffffff', order: 4 },
                { name: 'sticky', type: 'boolean', value: 'false', order: 5 },
                { name: 'showSearch', type: 'boolean', value: 'true', order: 6 },
                { name: 'showLogin', type: 'boolean', value: 'false', order: 7 }
              ]
            }
          }
        }),

    // BLOQUE - Contenedor de contenido
    prisma.component.upsert({
      where: { name: 'layout_block' },
      update: {},
      create: {
        name: 'layout_block',
        type: 'block',
        category: 'content',
        description: 'Bloque contenedor para organizar contenido',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'title', type: 'string', required: false, order: 1 },
            { name: 'content', type: 'richtext', required: false, order: 2 },
            { name: 'backgroundColor', type: 'color', value: '#f8f9fa', order: 3 },
            { name: 'padding', type: 'select', options: ['small', 'medium', 'large'], value: 'medium', order: 4 },
            { name: 'margin', type: 'select', options: ['none', 'small', 'medium', 'large'], value: 'medium', order: 5 },
            { name: 'borderRadius', type: 'select', options: ['none', 'small', 'medium', 'large'], value: 'small', order: 6 }
          ]
        }
      }
    }),

    // BOTÓN - Elemento de interacción
    prisma.component.upsert({
      where: { name: 'ui_button' },
      update: {},
      create: {
        name: 'ui_button',
        type: 'ui',
        category: 'interaction',
        description: 'Botón reutilizable con múltiples variantes',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'text', type: 'string', required: true, order: 1 },
            { name: 'variant', type: 'select', options: ['primary', 'secondary', 'outline', 'ghost'], value: 'primary', order: 2 },
            { name: 'size', type: 'select', options: ['small', 'medium', 'large'], value: 'medium', order: 3 },
            { name: 'href', type: 'string', required: false, order: 4 },
            { name: 'onClick', type: 'string', required: false, order: 5 },
            { name: 'disabled', type: 'boolean', value: 'false', order: 6 },
            { name: 'fullWidth', type: 'boolean', value: 'false', order: 7 }
          ]
        }
      }
    }),

    // TEXTO - Contenido textual
    prisma.component.upsert({
      where: { name: 'ui_text' },
      update: {},
      create: {
        name: 'ui_text',
        type: 'ui',
        category: 'content',
        description: 'Texto con diferentes estilos y tamaños',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'content', type: 'string', required: true, order: 1 },
            { name: 'type', type: 'select', options: ['paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6'], value: 'paragraph', order: 2 },
            { name: 'color', type: 'color', value: '#333333', order: 3 },
            { name: 'align', type: 'select', options: ['left', 'center', 'right', 'justify'], value: 'left', order: 4 },
            { name: 'weight', type: 'select', options: ['normal', 'medium', 'semibold', 'bold'], value: 'normal', order: 5 }
          ]
        }
      }
    }),

    // IMAGEN - Elemento multimedia
    prisma.component.upsert({
      where: { name: 'ui_image' },
      update: {},
      create: {
        name: 'ui_image',
        type: 'ui',
        category: 'media',
        description: 'Imagen con opciones de tamaño y estilo',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'src', type: 'string', required: true, order: 1 },
            { name: 'alt', type: 'string', required: true, order: 2 },
            { name: 'width', type: 'number', value: '400', order: 3 },
            { name: 'height', type: 'number', value: '300', order: 4 },
            { name: 'fit', type: 'select', options: ['cover', 'contain', 'fill', 'none'], value: 'cover', order: 5 },
            { name: 'borderRadius', type: 'select', options: ['none', 'small', 'medium', 'large'], value: 'none', order: 6 }
          ]
        }
      }
    }),

    // FORMULARIO - Entrada de datos
    prisma.component.upsert({
      where: { name: 'form_input' },
      update: {},
      create: {
        name: 'form_input',
        type: 'form',
        category: 'input',
        description: 'Campo de entrada de formulario',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'label', type: 'string', required: true, order: 1 },
            { name: 'placeholder', type: 'string', required: false, order: 2 },
            { name: 'type', type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'], value: 'text', order: 3 },
            { name: 'required', type: 'boolean', value: 'false', order: 4 },
            { name: 'disabled', type: 'boolean', value: 'false', order: 5 },
            { name: 'maxLength', type: 'number', value: '100', order: 6 }
          ]
        }
      }
    }),

    // CARD - Tarjeta de contenido
    prisma.component.upsert({
      where: { name: 'ui_card' },
      update: {},
      create: {
        name: 'ui_card',
        type: 'ui',
        category: 'content',
        description: 'Tarjeta contenedora para mostrar información',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'title', type: 'string', required: false, order: 1 },
            { name: 'subtitle', type: 'string', required: false, order: 2 },
            { name: 'content', type: 'richtext', required: false, order: 3 },
            { name: 'image', type: 'string', required: false, order: 4 },
            { name: 'backgroundColor', type: 'color', value: '#ffffff', order: 5 },
            { name: 'shadow', type: 'select', options: ['none', 'small', 'medium', 'large'], value: 'medium', order: 6 },
            { name: 'borderRadius', type: 'select', options: ['none', 'small', 'medium', 'large'], value: 'medium', order: 7 }
          ]
        }
      }
    }),

    // HERO - Sección principal
    prisma.component.upsert({
      where: { name: 'layout_hero' },
      update: {},
      create: {
        name: 'layout_hero',
        type: 'layout',
        category: 'content',
        description: 'Sección hero principal de la página',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'title', type: 'string', required: true, order: 1 },
            { name: 'subtitle', type: 'string', required: false, order: 2 },
            { name: 'description', type: 'string', required: false, order: 3 },
            { name: 'backgroundImage', type: 'string', required: false, order: 4 },
            { name: 'backgroundColor', type: 'color', value: '#f8f9fa', order: 5 },
            { name: 'textColor', type: 'color', value: '#333333', order: 6 },
            { name: 'height', type: 'select', options: ['small', 'medium', 'large', 'full'], value: 'medium', order: 7 }
          ]
        }
      }
    }),

    // NAVIGATION - Menú de navegación
    prisma.component.upsert({
      where: { name: 'ui_navigation' },
      update: {},
      create: {
        name: 'ui_navigation',
        type: 'ui',
        category: 'navigation',
        description: 'Menú de navegación horizontal o vertical',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'items', type: 'array', required: true, order: 1 },
            { name: 'orientation', type: 'select', options: ['horizontal', 'vertical'], value: 'horizontal', order: 2 },
            { name: 'showLogo', type: 'boolean', value: 'true', order: 3 },
            { name: 'sticky', type: 'boolean', value: 'false', order: 4 },
            { name: 'backgroundColor', type: 'color', value: '#ffffff', order: 5 },
            { name: 'textColor', type: 'color', value: '#333333', order: 6 }
          ]
        }
      }
    }),

    // FOOTER - Pie de página
    prisma.component.upsert({
      where: { name: 'layout_footer' },
      update: {},
      create: {
        name: 'layout_footer',
        type: 'layout',
        category: 'navigation',
        description: 'Pie de página con enlaces y información',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'logo', type: 'string', required: false, order: 1 },
            { name: 'description', type: 'string', required: false, order: 2 },
            { name: 'links', type: 'array', required: false, order: 3 },
            { name: 'socialMedia', type: 'array', required: false, order: 4 },
            { name: 'copyright', type: 'string', required: false, order: 5 },
            { name: 'backgroundColor', type: 'color', value: '#333333', order: 6 },
            { name: 'textColor', type: 'color', value: '#ffffff', order: 7 }
          ]
        }
      }
    }),

    // FORMULARIO DE CONTACTO - Componente funcional
    prisma.component.upsert({
      where: { name: 'form_contact' },
      update: {},
      create: {
        name: 'form_contact',
        type: 'form',
        category: 'interaction',
        description: 'Formulario de contacto funcional',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'title', type: 'string', value: 'Formulario de Contacto', required: false, order: 1 },
            { name: 'description', type: 'string', value: 'Envíanos un mensaje y te responderemos pronto', required: false, order: 2 },
            { name: 'buttonText', type: 'string', value: 'Enviar Mensaje', required: false, order: 3 },
            { name: 'backgroundColor', type: 'color', value: '#ffffff', required: false, order: 4 }
          ]
        }
      }
    }),

    // GALERÍA - Componente de imágenes
    prisma.component.upsert({
      where: { name: 'gallery_grid' },
      update: {},
      create: {
        name: 'gallery_grid',
        type: 'block',
        category: 'media',
        description: 'Galería de imágenes en grid',
        isActive: true,
        organizationId: organization.id,
        properties: {
          create: [
            { name: 'title', type: 'string', value: 'Galería de Imágenes', required: false, order: 1 },
            { name: 'description', type: 'string', value: 'Colección de imágenes organizadas', required: false, order: 2 },
            { name: 'columns', type: 'select', value: '3', options: ['2', '3', '4'], required: false, order: 3 },
            { name: 'images', type: 'array', required: false, order: 4 }
          ]
        }
      }
    })
  ]);

  console.log(`✅ ${components.length} componentes creados exitosamente`);

  // Crear algunas instancias de ejemplo
  console.log('🔧 Creando instancias de componentes de ejemplo...');
  
  const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });
  if (homePage) {
    await Promise.all([
      // Instancia del header en la página principal
      prisma.componentInstance.create({
        data: {
          componentId: (await prisma.component.findUnique({ where: { name: 'layout_header' } }))!.id,
          pageId: homePage.id,
          order: 1,
          data: {
            logo: '/logo.png',
            menuItems: ['Inicio', 'Servicios', 'Contacto', 'Sobre Nosotros'],
            backgroundColor: '#ffffff',
            sticky: true,
            showSearch: true
          }
        }
      }),

      // Instancia del hero en la página principal
      prisma.componentInstance.create({
        data: {
          componentId: (await prisma.component.findUnique({ where: { name: 'layout_hero' } }))!.id,
          pageId: homePage.id,
          order: 2,
          data: {
            title: 'Bienvenidos a QA Services',
            subtitle: 'Soluciones profesionales de calidad',
            description: 'Ofrecemos servicios de testing y aseguramiento de calidad para tu proyecto',
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            height: 'large'
          }
        }
      }),

      // Instancia de un botón en la página principal
      prisma.componentInstance.create({
        data: {
          componentId: (await prisma.component.findUnique({ where: { name: 'ui_button' } }))!.id,
          pageId: homePage.id,
          order: 3,
          data: {
            text: 'Conoce Nuestros Servicios',
            variant: 'primary',
            size: 'large',
            href: '/servicios',
            fullWidth: false
          }
        }
      })
    ]);
  }

  console.log('✅ Instancias de componentes de ejemplo creadas');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
