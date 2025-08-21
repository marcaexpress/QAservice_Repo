import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { CMSService } from '@/lib/cms-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string; version: string } }
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

    const { pageId, version } = params;
    if (!pageId || !version) {
      return NextResponse.json(
        { error: 'ID de página y versión son requeridos' },
        { status: 400 }
      );
    }

    const versionNumber = parseInt(version, 10);
    if (isNaN(versionNumber)) {
      return NextResponse.json(
        { error: 'Número de versión inválido' },
        { status: 400 }
      );
    }

    // Delete page version
    const result = await CMSService.deletePageVersion(pageId, versionNumber, decoded.userId);
    
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
    console.error('Error deleting page version:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
