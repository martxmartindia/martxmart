import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total blog posts
    const totalBlogs = await prisma.blog.count({
      where: {
        authorId: session.user.id,
        isDeleted: false,
      },
    });

    // Get published blog posts
    const publishedBlogs = await prisma.blog.count({
      where: {
        authorId: session.user.id,
        status: 'PUBLISHED',
        isDeleted: false,
      },
    });

    // Get total views
    const totalViews = await prisma.view.count({
      where: {
        blog: {
          authorId: session.user.id,
          isDeleted: false,
        },
      },
    });

    // Get total likes
    const totalLikes = await prisma.like.count({
      where: {
        blog: {
          authorId: session.user.id,
          isDeleted: false,
        },
      },
    });

    // Get total comments
    const totalComments = await prisma.blogComment.count({
      where: {
        id: {
          in: (await prisma.blogComment.findMany({
            where: {
              post: {
                authorId: session.user.id,
                isDeleted: false,
              },
            },
            select: { id: true },
          })).map((comment) => comment.id)
        }
      }
    })

    // Get top performing blogs
    const topBlogs = await prisma.blog.findMany({
      where: {
        authorId: session.user.id,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: 5,
    });

    // Get recent blogs
    const recentBlogs = await prisma.blog.findMany({
      where: {
        authorId: session.user.id,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Calculate engagement rate
    const engagementRate = totalBlogs > 0
      ? ((totalViews + totalLikes + totalComments) / (totalBlogs * 100)) * 100
      : 0;

    return NextResponse.json({
      totalBlogs,
      publishedBlogs,
      totalViews,
      topBlogs: topBlogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        views: blog.viewCount,
      })),
      recentBlogs: recentBlogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        views: blog.viewCount,
      })),
    });
  } catch (error) {
    console.error('[AUTHOR_ANALYTICS]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}