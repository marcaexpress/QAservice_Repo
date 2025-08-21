import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Servicio CMS Centralizado
 * Una sola fuente de verdad para todas las operaciones del CMS
 */
export class CMSService {
  private static instance: CMSService;

  private constructor() {}

  public static getInstance(): CMSService {
    if (!CMSService.instance) {
      CMSService.instance = new CMSService();
    }
    return CMSService.instance;
  }

  /**
   * Obtiene una página por slug
   */
  async getPage(slug: string) {
    try {
      const page = await prisma.page.findUnique({
        where: { slug },
        include: {
          accessRules: {
            include: {
              role: true,
              user: true,
              organization: true
            }
          },
          versions: {
            orderBy: { version: 'desc' },
            take: 1
          }
        }
      });

      return page;
    } catch (error) {
      console.error('Error getting page:', error);
      return null;
    }
  }

  /**
   * Obtiene todas las páginas
   */
  async getAllPages() {
    try {
      const pages = await prisma.page.findMany({
        include: {
          _count: {
            select: {
              accessRules: true,
              versions: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return pages;
    } catch (error) {
      console.error('Error getting all pages:', error);
      return [];
    }
  }

  /**
   * Crea una nueva página
   */
  async createPage(data: {
    title: string;
    slug: string;
    description?: string;
    status?: string;
    blocks?: any[];
    createdBy: string;
    organizationId: string;
  }) {
    try {
      const page = await prisma.page.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: data.status || 'DRAFT',
          published: false,
          blocks: data.blocks || [],
          createdBy: data.createdBy,
          updatedBy: data.createdBy,
          organizationId: data.organizationId
        }
      });

      // Crear regla de acceso pública por defecto
      await prisma.pageAccessRule.create({
        data: {
          pageId: page.id,
          accessType: 'PUBLIC',
          permissions: ['VIEW']
        }
      });

      return page;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  /**
   * Actualiza una página existente
   */
  async updatePage(slug: string, data: {
    title?: string;
    description?: string;
    status?: string;
    blocks?: any[];
    updatedBy: string;
  }) {
    try {
      const page = await prisma.page.update({
        where: { slug },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      return page;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  /**
   * Publica una página
   */
  async publishPage(slug: string, publishedBy: string) {
    try {
      const page = await prisma.page.findUnique({ where: { slug } });
      if (!page) throw new Error('Page not found');

      if (!page.blocks || (page.blocks as any[]).length === 0) {
        throw new Error('Cannot publish page without content');
      }

      // Crear nueva versión
      const latestVersion = await prisma.pageVersion.findFirst({
        where: { pageId: page.id },
        orderBy: { version: 'desc' }
      });

      const newVersionNumber = (latestVersion?.version || 0) + 1;

      await prisma.pageVersion.create({
        data: {
          pageId: page.id,
          version: newVersionNumber,
          title: page.title,
          description: page.description,
          blocks: page.blocks,
          creator: publishedBy
        }
      });

      // Actualizar página
      const publishedPage = await prisma.page.update({
        where: { slug },
        data: {
          status: 'PUBLISHED',
          published: true,
          publishedAt: new Date(),
          updatedBy: publishedBy,
          updatedAt: new Date()
        }
      });

      return publishedPage;
    } catch (error) {
      console.error('Error publishing page:', error);
      throw error;
    }
  }

  /**
   * Cambia el estado de una página
   */
  async changePageStatus(slug: string, status: string, updatedBy: string) {
    try {
      const page = await prisma.page.findUnique({ where: { slug } });
      if (!page) throw new Error('Page not found');

      let updateData: any = { 
        status, 
        updatedBy, 
        updatedAt: new Date() 
      };

      // Manejar estado PUBLISHED
      if (status === 'PUBLISHED') {
        if (!page.blocks || (page.blocks as any[]).length === 0) {
          throw new Error('Cannot publish page without content');
        }
        updateData.published = true;
        updateData.publishedAt = new Date();
      } else {
        if (page.status === 'PUBLISHED') {
          updateData.published = false;
          updateData.publishedAt = null;
        }
      }

      const updatedPage = await prisma.page.update({
        where: { slug },
        data: updateData
      });

      return updatedPage;
    } catch (error) {
      console.error('Error changing page status:', error);
      throw error;
    }
  }

  /**
   * Elimina una página
   */
  async deletePage(slug: string) {
    try {
      // Las reglas de acceso y versiones se eliminan automáticamente por CASCADE
      const deletedPage = await prisma.page.delete({
        where: { slug }
      });

      return deletedPage;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }

  /**
   * Verifica si una página existe
   */
  async pageExists(slug: string): Promise<boolean> {
    try {
      const page = await prisma.page.findUnique({
        where: { slug },
        select: { id: true }
      });
      return !!page;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene páginas por estado
   */
  async getPagesByStatus(status: string) {
    try {
      const pages = await prisma.page.findMany({
        where: { status },
        include: {
          _count: {
            select: {
              accessRules: true,
              versions: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return pages;
    } catch (error) {
      console.error('Error getting pages by status:', error);
      return [];
    }
  }

  /**
   * Busca páginas por texto
   */
  async searchPages(query: string) {
    try {
      const pages = await prisma.page.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          _count: {
            select: {
              accessRules: true,
              versions: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return pages;
    } catch (error) {
      console.error('Error searching pages:', error);
      return [];
    }
  }

  /**
   * Elimina una versión específica de una página
   */
  async deletePageVersion(pageId: string, versionNumber: number, userId: string) {
    try {
      // Verificar que la versión existe
      const pageVersion = await prisma.pageVersion.findFirst({
        where: {
          pageId,
          version: versionNumber
        }
      });

      if (!pageVersion) {
        return {
          success: false,
          message: 'Versión no encontrada'
        };
      }

      // Eliminar la versión
      await prisma.pageVersion.delete({
        where: {
          id: pageVersion.id
        }
      });

      return {
        success: true,
        message: 'Versión eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error deleting page version:', error);
      return {
        success: false,
        message: 'Error al eliminar la versión'
      };
    }
  }

  /**
   * Restaura una versión específica de una página
   */
  async restorePageVersion(pageId: string, versionNumber: number, userId: string) {
    try {
      // Verificar que la versión existe
      const pageVersion = await prisma.pageVersion.findFirst({
        where: {
          pageId,
          version: versionNumber
        }
      });

      if (!pageVersion) {
        return {
          success: false,
          message: 'Versión no encontrada'
        };
      }

      // Restaurar la página con el contenido de la versión
      await prisma.page.update({
        where: { id: pageId },
        data: {
          title: pageVersion.title,
          description: pageVersion.description,
          blocks: pageVersion.blocks,
          updatedBy: userId,
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Versión restaurada exitosamente'
      };
    } catch (error) {
      console.error('Error restoring page version:', error);
      return {
        success: false,
        message: 'Error al restaurar la versión'
      };
    }
  }
}

// Exportar instancia singleton
export const cmsService = CMSService.getInstance();
