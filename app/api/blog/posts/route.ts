import { type NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import { cookies } from "next/headers"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build the where clause based on query parameters
    const where: any = {
      publishedAt: { not: null },
      isDeleted: false
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    if (tag) {
      where.tags = {
        contains: tag,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const totalCount = await prisma.blog.count({ where })

    // Get posts with pagination
    const posts = await prisma.blog.findMany({
      where,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      posts,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
   const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const decoded = await getAuthenticatedUser();
    if (!decoded || decoded.role !== "AUTHOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check if user is author or admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Only authors and admins can create posts" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.content || !data.categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    // Check if slug already exists
    const existingPost = await prisma.blog.findUnique({
      where: { slug: data.slug },
    })

    if (existingPost) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 })
    }

    // Create the blog post
    const post = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        publishedAt: data.published ? new Date() : null,
        tags: data.tags,
        category: {
          connect: { id: data.categoryId },
        },
        author: {
          connect: { id: user.id },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
