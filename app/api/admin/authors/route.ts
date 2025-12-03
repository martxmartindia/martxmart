import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || undefined

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (search) {
      where.user = {
        OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
      }
    }

    // Get authors with pagination
    const authors = await prisma.author.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    // Transform the data to include post count
    const authorsWithPostCount = authors.map((author) => ({
      ...author,
      postCount: author._count.blogs,
      _count: undefined,
    }))

    // Get total count for pagination
    const total = await prisma.author.count({ where })

    return NextResponse.json({
      authors: authorsWithPostCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching authors:", error)
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    // Get request body
    const data = await req.json()    

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user with AUTHOR role
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "AUTHOR",
      },
    })

    // Create author profile
    const author = await prisma.author.create({
      data: {
        name: data.name,
        userId: user.id,
        email: data.email,
        password: hashedPassword,
        bio: data.bio || null,
        isActive: true,
      },
    })

    return NextResponse.json({ message: "Author created successfully", id: author.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating author:", error)
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 })
  }
}

