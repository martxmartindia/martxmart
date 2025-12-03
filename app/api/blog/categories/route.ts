import { type NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
 import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    // Build the where clause based on query parameters
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get categories with post count
    const categories = await prisma.blogCategory.findMany({
      where,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({message:"success",data:categories,status:200})
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return NextResponse.json({ error: "Failed to fetch blog categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError;

    const finduser = await getAuthenticatedUser()
    if (!finduser ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = finduser.id
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id:userId as string },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can create categories" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slug already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug: data.slug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 })
    }

    // Create the blog category
    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating blog category:", error)
    return NextResponse.json({ error: "Failed to create blog category" }, { status: 500 })
  }
}
