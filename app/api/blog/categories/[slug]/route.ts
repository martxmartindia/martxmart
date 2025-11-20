import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import {verifyJWT} from "@/utils/auth"

export async function GET( request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    
  const slug = (await params).slug;

    const category = await prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { publishedAt: { not: null } },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                // image: true,
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
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching blog category:", error)
    return NextResponse.json({ error: "Failed to fetch blog category" }, { status: 500 })
  }
}

export async function PUT( request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    
  const slug = (await params).slug;

    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decode = await verifyJWT(token)

    if (!decode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decode.payload.id as string },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can update categories" }, { status: 403 })
    }
    const data = await request.json()

    // Check if category exists
    const category = await prisma.blogCategory.findUnique({
      where: { slug },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // If slug is being changed, check if new slug already exists
    if (data.slug && data.slug !== slug) {
      const existingCategory = await prisma.blogCategory.findUnique({
        where: { slug: data.slug },
      })

      if (existingCategory) {
        return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 })
      }
    }

    // Update the category
    const updatedCategory = await prisma.blogCategory.update({
      where: { slug },
      data: {
        name: data.name,
        ...(data.slug ? { slug: data.slug } : {}),
      },
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating blog category:", error)
    return NextResponse.json({ error: "Failed to update blog category" }, { status: 500 })
  }
}

export async function DELETE( request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    
  const slug = (await params).slug;
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decode = await verifyJWT(token)

    if (!decode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId=decode.payload.id
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId as string  },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can delete categories" }, { status: 403 })
    }
    // Check if category exists
    const category = await prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        posts: true,
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if category has posts
    if (category.posts.length > 0) {
      return NextResponse.json({ error: "Cannot delete category with associated posts" }, { status: 400 })
    }

    // Delete the category
    await prisma.blogCategory.delete({
      where: { slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog category:", error)
    return NextResponse.json({ error: "Failed to delete blog category" }, { status: 500 })
  }
}
