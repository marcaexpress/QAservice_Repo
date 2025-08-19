const { Client } = require('pg');

async function setupNeonDatabase() {
  console.log('🚀 Configurando base de datos Neon...');
  
  // Estas variables deben estar en tu .env
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL no está configurada en .env');
    console.log('📝 Crea un archivo .env con tu conexión de Neon');
    return;
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Conectado a Neon Database');

    // Crear tablas si no existen
    const createTablesQuery = `
      -- Crear tabla de usuarios si no existe
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        "emailVerified" TIMESTAMP,
        image TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "organizationId" TEXT
      );

      -- Crear tabla de organizaciones si no existe
      CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Crear tabla de roles si no existe
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "organizationId" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Crear tabla de permisos si no existe
      CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(action, resource)
      );

      -- Crear tabla de permisos de roles si no existe
      CREATE TABLE IF NOT EXISTS role_permissions (
        id TEXT PRIMARY KEY,
        "roleId" TEXT NOT NULL,
        "permissionId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("roleId", "permissionId")
      );

      -- Crear tabla de asignaciones de roles si no existe
      CREATE TABLE IF NOT EXISTS role_assignments (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "roleId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "roleId")
      );
    `;

    await client.query(createTablesQuery);
    console.log('✅ Tablas creadas correctamente');

    // Insertar datos iniciales
    const insertInitialData = `
      -- Insertar organización por defecto
      INSERT INTO organizations (id, name, slug) 
      VALUES ('org_default', 'QA Services', 'qa-services')
      ON CONFLICT (id) DO NOTHING;

      -- Insertar permisos básicos
      INSERT INTO permissions (id, action, resource) VALUES
        ('perm_1', 'create', 'page'),
        ('perm_2', 'read', 'page'),
        ('perm_3', 'update', 'page'),
        ('perm_4', 'delete', 'page'),
        ('perm_5', 'create', 'user'),
        ('perm_6', 'read', 'user'),
        ('perm_7', 'update', 'user'),
        ('perm_8', 'delete', 'user')
      ON CONFLICT (id) DO NOTHING;

      -- Insertar rol de administrador
      INSERT INTO roles (id, name, description, "organizationId") 
      VALUES ('role_admin', 'Administrador', 'Rol con todos los permisos', 'org_default')
      ON CONFLICT (id) DO NOTHING;

      -- Asignar todos los permisos al rol de administrador
      INSERT INTO role_permissions ("roleId", "permissionId") 
      SELECT 'role_admin', id FROM permissions
      ON CONFLICT ("roleId", "permissionId") DO NOTHING;
    `;

    await client.query(insertInitialData);
    console.log('✅ Datos iniciales insertados');

    console.log('🎉 Base de datos Neon configurada correctamente!');
    console.log('📝 Ahora puedes ejecutar: npm run db:push');

  } catch (error) {
    console.error('❌ Error configurando Neon:', error);
  } finally {
    await client.end();
  }
}

setupNeonDatabase();
