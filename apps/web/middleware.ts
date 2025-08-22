// apps/web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ Middleware mínimo que nunca bloquea - Para despliegue inmediato
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// ✅ Matcher vacío: no intercepta nada (opcional)
export const config = {
  matcher: [],
};
