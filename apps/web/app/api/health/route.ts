// Healthcheck API para producción
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const checks: any = {};
  // Verificar variables de entorno críticas
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
    'NEXTAUTH_URL'
  ];
  checks.env = {};
  requiredVars.forEach((key) => {
    const value = process.env[key];
    checks.env[key] = value ? 'OK' : 'MISSING';
    checks.env[key + '_value'] = value || null;
    console.log(`[HEALTHCHECK] ${key}:`, value);
  });

  // Verificar conexión a la base de datos
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = 'OK';
  } catch (err) {
    checks.db = 'ERROR';
    checks.dbError = String(err);
  }

  return NextResponse.json({
    status: 'healthcheck',
    checks,
    timestamp: new Date().toISOString()
  });
}
