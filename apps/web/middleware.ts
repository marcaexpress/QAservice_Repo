// apps/web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⬇️ Por ahora no intercepta nada. Así descartamos que afecte a /_next/static o /_tw.css
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // ⬅️ lo dejaremos vacío mientras aseguramos estilos
};
