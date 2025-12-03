import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Define blog status type to match Prisma schema
type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'AUTHOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({
        error: "Unauthorized: Missing user ID"
      }, { status: 401 });
    }
    const body = await req.json();
    const { title, content, excerpt, metaTitle, metaDescription, tags, featuredImage, status, categoryId } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({
        error: "Title, content, and category are required fields"
      }, { status: 400 });
    }

    // Generate a URL-friendly slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Verify category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({
        error: "Invalid category ID"
      }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        tags: tags || [],
        featuredImage,
        status: status as BlogStatus || 'DRAFT',
        authorId:userId as string,
        categoryId:categoryId || "general",
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        author: {
          select: {
            name: true,
            profileImage: true
          }
        }
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("[BLOG_POST]", error);
    return NextResponse.json({
      error: "Failed to create blog post"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'AUTHOR' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({
        error: "Unauthorized"
      }, { status: 401 });
    }

    const userId = session.user.id;
    if(!userId){
      return NextResponse.json({
        error: "Unauthorized: Missing user ID"
      }, { status: 401 });
    }
  
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const status = req.nextUrl.searchParams.get('status');
    const search = req.nextUrl.searchParams.get('search');
    const categoryId = req.nextUrl.searchParams.get('categoryId');

    const where = {
      authorId: userId as string,
      isDeleted: false,
      ...(status && { status: status as BlogStatus }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          },
          author: {
            select: {
              name: true,
              profileImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("[BLOG_GET]", error);
    return NextResponse.json({
      error: "Failed to fetch blog posts"
    }, { status: 500 });
  }
}