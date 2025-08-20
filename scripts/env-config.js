/**
 * 🌍 Configuración de Entornos para Scripts - QA Services
 * Configuración separada para desarrollo y producción
 */

// Configuración de desarrollo/deployment
const developmentConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Development/Deployment'
  },
  jwt: {
    secret: 'qa-services-jwt-secret-key-2024-dev-environment'
  }
};

// Configuración de producción
const productionConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Production'
  },
  jwt: {
    secret: 'qa-services-jwt-secret-key-2024-production-environment'
  }
};

// Función para obtener configuración según argumentos
function getConfig() {
  const args = process.argv.slice(2);
  
  if (args.includes('--production') || args.includes('--prod')) {
    console.log('🌍 Usando configuración de PRODUCCIÓN');
    return productionConfig;
  }
  
  if (args.includes('--development') || args.includes('--dev')) {
    console.log('🌍 Usando configuración de DESARROLLO');
    return developmentConfig;
  }
  
  // Por defecto, usar desarrollo
  console.log('🌍 Usando configuración de DESARROLLO (por defecto)');
  return developmentConfig;
}

// Función para mostrar ayuda
function showHelp() {
  console.log('\n🌍 Configuración de Entornos - QA Services');
  console.log('==========================================\n');
  console.log('Uso:');
  console.log('  --production, --prod    Usar configuración de producción');
  console.log('  --development, --dev    Usar configuración de desarrollo');
  console.log('  (sin argumentos)        Usar desarrollo por defecto\n');
  console.log('Ejemplos:');
  console.log('  node scripts/seed-production.js --production');
  console.log('  node scripts/migrate-to-production.js --dev');
}

module.exports = {
  getConfig,
  showHelp,
  developmentConfig,
  productionConfig
};
