import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'AUTHOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    
    const skip = (page - 1) * limit
    
    // Build filter conditions
    const where: any = {
      isDeleted: false,
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }
    
    // Get blogs with pagination
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })
    
    // Get total count for pagination
    const total = await prisma.blog.count({ where })
    
    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const token = (await cookies()).get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const decoded = await verifyJwtToken(token)
    
    if (!decoded || !decoded.payload || (decoded.payload.role !== 'ADMIN' && decoded.payload.role !== 'AUTHOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ) 
    }
    
    const userId = decoded.payload.id
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }
    
    // Get request body
    const data = await req.json()
    
    // Validate required fields
    if (!data.title || !data.slug || !data.content) {      
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if slug is unique
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: data.slug },
    })
    
    if (existingBlog) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }
   
    
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: userId as string }
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Create blog
    try {
      const blog = await prisma.blog.create({
        data: {
          categoryId: data.categoryId, // Add required categoryId field
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          featuredImage: data.featuredImage,
          status: data.status || 'DRAFT',
          tags: Array.isArray(data.tags) ? data.tags : [],
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          authorId: existingAdmin.id,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      
      return NextResponse.json(blog, { status: 201 });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create blog'
    console.error('Error creating blog:', { error: errorMessage })
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

