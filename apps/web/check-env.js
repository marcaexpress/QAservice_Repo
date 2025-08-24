// Verifica que DATABASE_URL esté definida antes del build
if (!process.env.DATABASE_URL) {
  throw new Error('Falta la variable de entorno crítica: DATABASE_URL. Configúrala en el dashboard de Vercel.');
}
