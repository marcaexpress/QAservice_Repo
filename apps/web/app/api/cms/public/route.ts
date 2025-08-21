import { NextRequest, NextResponse } from 'next/server';
import { cmsService } from '@/lib/cms-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug de página requerido' },
        { status: 400 }
      );
    }

    // Determine access control based on authentication
    let accessControl: {
      userId: string;
      userRoles: string[];
      organizationId?: string;
    } = {
      userId: 'anonymous',
      userRoles: ['public'],
      organizationId: undefined
    };

    // Try to get user info from auth token if available
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        // Import verifyToken dynamically to avoid Edge Runtime issues
        const { verifyToken } = await import('@/lib/jwt');
        const decoded = verifyToken(token);
        
        if (decoded) {
          accessControl = {
            userId: decoded.userId,
            userRoles: [decoded.role],
            organizationId: decoded.organizationId
          };
        }
      }
    } catch (error) {
      // Continue as anonymous user if token verification fails
      console.log('Token verification failed, continuing as anonymous user');
    }

    // Get page using cmsService
    const page = await cmsService.getPage(slug);
    
    if (!page) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page
    });

  } catch (error) {
    console.error('Error getting public page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
