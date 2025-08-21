import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { CMSService } from '@/lib/cms-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const { pageId } = params;
    if (!pageId) {
      return NextResponse.json(
        { error: 'ID de página requerido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { versionNumber } = body;

    if (!versionNumber || typeof versionNumber !== 'number') {
      return NextResponse.json(
        { error: 'Número de versión requerido' },
        { status: 400 }
      );
    }

    // Restore page version
    const result = await CMSService.restorePageVersion(pageId, versionNumber, decoded.userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error restoring page version:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
