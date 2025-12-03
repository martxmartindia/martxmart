import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth-utils';


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const author = await prisma.author.findUnique({
      where: { email },
    });

    if (!author || !author.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, author.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signJWT({
      id: author.id,
      name: author.name,
      email: author.email || '',
      role: 'AUTHOR',
    });

    // Set cookie
    (await
      // Set cookie
      cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
      },
      token,
    });
  } catch (error) {
    console.error('[AUTHOR_LOGIN]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
