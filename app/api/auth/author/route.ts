import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/utils/auth';
import { authOptions } from '@/lib/auth';
import { encode } from 'next-auth/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find author in Author table
    const author = await prisma.author.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        user: true, // Include user relation for additional data
      },
    });

    if (!author || !author.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, author.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create NextAuth JWT token
    const token = await encode({
      token: {
        sub: author.id,
        name: author.name,
        email: author.email,
        role: 'AUTHOR',
        phone: author.user?.phone || undefined,
      },
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // Set NextAuth session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
      },
    });

    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[AUTHOR_LOGIN]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
