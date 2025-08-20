/**
 * 🌍 Configuración de Entornos - QA Services
 * Separa configuración de desarrollo y producción
 */

export interface EnvironmentConfig {
  database: {
    url: string;
    name: string;
  };
  jwt: {
    secret: string;
  };
  app: {
    url: string;
    environment: string;
  };
}

// Configuración de desarrollo/deployment
export const developmentConfig: EnvironmentConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Development/Deployment'
  },
  jwt: {
    secret: 'qa-services-jwt-secret-key-2024-dev-environment'
  },
  app: {
    url: 'http://localhost:3000',
    environment: 'development'
  }
};

// Configuración de producción
export const productionConfig: EnvironmentConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Production'
  },
  jwt: {
    secret: 'qa-services-jwt-secret-key-2024-production-environment'
  },
  app: {
    url: 'https://qa-services-d849kxe3s-marcaexpress-projects.vercel.app',
    environment: 'production'
  }
};

// Función para obtener configuración según entorno
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return productionConfig;
  }
  
  return developmentConfig;
}

// Función para obtener solo la configuración de base de datos
export function getDatabaseConfig() {
  const config = getEnvironmentConfig();
  return config.database;
}

// Función para obtener solo la configuración JWT
export function getJWTConfig() {
  const config = getEnvironmentConfig();
  return config.jwt;
}

// Función para obtener solo la configuración de la app
export function getAppConfig() {
  const config = getEnvironmentConfig();
  return config.app;
}

// Exportar configuraciones individuales para uso directo
export const config = {
  development: developmentConfig,
  production: productionConfig,
  current: getEnvironmentConfig()
};
