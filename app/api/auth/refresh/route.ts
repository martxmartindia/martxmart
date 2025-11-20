import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT, signJWT } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    // CSRF protection
    if (!request.headers.get('X-Refresh-Token')) {
      return NextResponse.json(
        { error: 'Missing refresh token header' },
        { status: 403 }
      );
    }

    // Get refresh token from cookie or body
    const cookieStore = await cookies();
    let refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
      const body = await request.json();
      refreshToken = body.refreshToken;
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = await verifyJWT(refreshToken, 'refresh');
    if (!decoded || typeof decoded !== 'object') {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate payload
    const payload = {
      id: decoded.payload.id as string,
      email: typeof decoded.payload.email === 'string' ? decoded.payload.email : undefined,
      name: decoded.payload.name as string,
      role: decoded.payload.role as string,
    };

    // Generate new access and refresh tokens
    const newAccessToken = await signJWT(payload, 'access');
    const newRefreshToken = await signJWT(payload, 'refresh');

    // Set new tokens in cookies
    cookieStore.set('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600, // 1 hour
    });
    cookieStore.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days
    });

    return NextResponse.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    console.error('Error refreshing token:', {
      error: error.message,
      clientIp: request.headers.get('x-forwarded-for') || 'unknown',
    });
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }
    if (error.name === 'InvalidTokenError') {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}