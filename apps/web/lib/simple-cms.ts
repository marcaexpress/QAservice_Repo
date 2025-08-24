// Servicio CMS simple para despliegue
export const simpleCmsService = {
  async getAllPages() {
    return [
      {
        id: '1',
        title: 'Página de Inicio',
        slug: 'inicio',
        description: 'Página principal del sitio',
        status: 'PUBLISHED',
        published: true,
        blocks: []
      },
      {
        id: '2', 
        title: 'Servicios',
        slug: 'servicios',
        description: 'Nuestros servicios de QA',
        status: 'PUBLISHED',
        published: true,
        blocks: []
      }
    ];
  },

  async createPage(data: any) {
    return {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  async pageExists(slug: string) {
    return false;
  }
};
