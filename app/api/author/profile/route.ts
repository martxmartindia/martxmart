import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/author/profile - Get author profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const author = await prisma.author.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        specialty: true,
        socialLinks: true,
        location: true,
        education: true,
        experience: true,
        achievements: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('[AUTHOR_PROFILE_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/author/profile - Update author profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const updatedAuthor = await prisma.author.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
        bio: data.bio,
        specialty: data.specialty,
        socialLinks: data.socialLinks,
        location: data.location,
        education: data.education,
        experience: data.experience,
        achievements: data.achievements,
        website: data.website,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        specialty: true,
        socialLinks: true,
        location: true,
        education: true,
        experience: true,
        achievements: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedAuthor);
  } catch (error) {
    console.error('[AUTHOR_PROFILE_UPDATE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}