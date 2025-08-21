import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cmsService } from '@/lib/cms-service';

export async function GET(
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

    // Get page versions
    const result = await cmsService.getPageVersions(pageId, decoded.userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      versions: result.versions
    });

  } catch (error) {
    console.error('Error getting page versions:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

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
    const { title, description, blocks, metadata } = body;

    if (!title || !blocks) {
      return NextResponse.json(
        { error: 'Título y bloques son requeridos' },
        { status: 400 }
      );
    }

    // Create new version
    const result = await CMSService.createPageVersion(
      pageId,
      {
        title,
        description,
        blocks,
        metadata
      },
      decoded.userId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Versión creada exitosamente',
      version: result.version
    });

  } catch (error) {
    console.error('Error creating page version:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
