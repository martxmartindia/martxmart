import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";


export async function GET(req: Request) {
  try {
    // Check authentication
    const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const decoded = await getAuthenticatedUser();
    if (!decoded || decoded.role !== "AUTHOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || undefined
    const search = searchParams.get("search") || undefined

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      isDeleted: false,
      authorId: decoded.id,
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
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
        createdAt: "desc",
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
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
       const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const decoded = await getAuthenticatedUser();
    if (!decoded || decoded.role !== "AUTHOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = decoded.id

    // Get request body
    const data = await req.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slug is unique
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: data.slug },
    })

    if (existingBlog) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    // Create blog
    const blog = await prisma.blog.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        status: data.status,
        tags: Array.isArray(data.tags) ? data.tags : [],
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        authorId: userId as string,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    // Check authentication
      const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const decoded = await getAuthenticatedUser();
    if (!decoded || (decoded.role !== "AUTHOR" && decoded.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id

    // Get request body
    const data = await req.json()

    // Validate required fields
    if (!data.id || !data.title || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if blog exists and belongs to the author
    const existingBlog = await prisma.blog.findFirst({
      where: {
        id: data.id,
        authorId: userId as string,
        isDeleted: false,
      },
    })

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    // Check if new slug is unique (if provided)
    if (data.slug && data.slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findFirst({
        where: {
          slug: data.slug,
          id: { not: data.id },
          isDeleted: false,
        },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
      }
    }

    // Update blog
    const blog = await prisma.blog.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug || existingBlog.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        status: data.status,
        tags: Array.isArray(data.tags) ? data.tags : existingBlog.tags,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    // Check authentication
      const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const decoded = await getAuthenticatedUser();
    if (!decoded || (decoded.role !== "AUTHOR" && decoded.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const userId = decoded.id

    // Get blog ID from URL
    const { searchParams } = new URL(req.url)
    const blogId = searchParams.get("id")

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    // Check if blog exists and belongs to the author
    const existingBlog = await prisma.blog.findFirst({
      where: {
        id: blogId,
        authorId: userId as string,
        isDeleted: false,
      },
    })

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    // Soft delete the blog
    await prisma.blog.update({
      where: { id: blogId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}

