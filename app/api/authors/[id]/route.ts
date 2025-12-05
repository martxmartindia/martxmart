import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
 request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
 ) {
  try {
    const {id: authorId} = await params;

    const author = await prisma.author.findUnique({
      where: {
        id: authorId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
        socialLinks: true,
        createdAt: true,
      },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: authorId,
        status: 'PUBLISHED',
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return NextResponse.json({
      author,
      blogs,
    });
  } catch (error) {
    console.error('[AUTHORS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}