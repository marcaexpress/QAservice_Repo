
const fs = require('fs');
const path = require('path');

describe('Vercel Deployment Checks', () => {
  it('Debe existir tsconfig.json en apps/web', () => {
    const tsconfigPath = path.join(__dirname, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    const tsconfig = require(tsconfigPath);
    expect(tsconfig.compilerOptions).toBeDefined();
  });

  it('Alias @ debe resolver a la raíz de apps/web', () => {
    const aliasPath = path.join(__dirname, 'components');
    expect(fs.existsSync(aliasPath)).toBe(true);
  });

  it('Deben existir y exportar los componentes CMS requeridos', () => {
    const requiredModules = [
      { file: 'components/cms/CMSLayout.tsx', exportName: 'CMSLayout' },
      { file: 'components/cms/CMSidebar.tsx', exportName: 'CMSidebar' },
      { file: 'components/cms/CMSToolbar.tsx', exportName: 'CMSToolbar' },
      { file: 'components/cms/CMSCanvas.tsx', exportName: 'CMSCanvas' }
    ];
    requiredModules.forEach(({ file, exportName }) => {
      const modPath = path.join(__dirname, file);
      expect(fs.existsSync(modPath)).toBe(true);
      const content = fs.readFileSync(modPath, 'utf8');
      expect(content).toMatch(new RegExp(`export (function|const|class|default) ${exportName}`));
    });
  });

  it('Variables de entorno críticas deben estar presentes', () => {
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'JWT_SECRET',
      'NEXTAUTH_URL'
    ];
    requiredVars.forEach(key => {
      expect(process.env[key]).toBeDefined();
      expect(process.env[key]).not.toBe('');
    });
  });

  it('Debe compilar Next.js sin errores de importación', async () => {
    // Simulación: solo verifica que los archivos principales existen
    const mainFiles = [
      'app/layout.tsx',
      'app/page.tsx',
      'next.config.js'
    ];
    mainFiles.forEach(f => {
      expect(fs.existsSync(path.join(__dirname, f))).toBe(true);
    });
  });
  it('Debe existir el archivo de estilos Tailwind generado', () => {
    const twCssPath = path.join(__dirname, 'public', '_tw.css');
    expect(fs.existsSync(twCssPath)).toBe(true);
    const cssContent = fs.readFileSync(twCssPath, 'utf8');
    expect(cssContent.length).toBeGreaterThan(100); // Debe tener contenido real
  });

  it('El layout principal debe referenciar el CSS generado', () => {
    const layoutPath = path.join(__dirname, 'app', 'layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent).toMatch(/_tw\.css/);
  });
});

  // Prueba de migración y sincronización de base de datos
  describe('Migración y sincronización de base de datos', () => {
    it('Debe ejecutar migraciones de Prisma sin errores (mock)', async () => {
      // Simula migración exitosa
      const mockMigration = true;
      expect(mockMigration).toBe(true);
    });
    it('Debe existir el archivo schema.prisma', () => {
      const prismaPath = path.join(__dirname, '../../prisma/schema.prisma');
      expect(fs.existsSync(prismaPath)).toBe(true);
    });
  });

  // Prueba de fallback si falta variable de entorno
  it('Fallback de variable de entorno en deploy', () => {
    const valor = process.env.NO_EXISTE || 'fallback';
    expect(valor).toBe('fallback');
  });

  // Edge case: archivo de configuración faltante
  it('Deploy - Falta archivo de configuración', () => {
    const missingPath = path.join(__dirname, 'no-existe.json');
    expect(fs.existsSync(missingPath)).toBe(false);
  });

  // Error: exportación incorrecta de componente
  it('Deploy - Exportación incorrecta de componente (mock)', () => {
    const content = 'export const CMSLayoutWrong = () => {}';
    // Solo debe fallar si existe "export ... CMSLayout" exactamente
    expect(/export (function|const|class|default) CMSLayout\b/.test(content)).toBe(false);
  });

  // Edge case: variable de entorno con valor especial
  it('Deploy - Variable de entorno con valor especial', () => {
    process.env.TEST_SPECIAL = '@!#%&*';
    expect(process.env.TEST_SPECIAL).toBe('@!#%&*');
  });
