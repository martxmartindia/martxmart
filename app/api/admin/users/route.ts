import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

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
    const role = searchParams.get("role") || undefined
    const search = searchParams.get("search") || undefined
    const status = searchParams.get("status")

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      isDeleted: false,
    }

  if (role && role !== "all") {
      where.role = role
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },

      ]
    }

      if (status && status !== "all") {
      where.isDeleted = status === "inactive"
    }

    // Get users with pagination
    const [users] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
              _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })
    ])

    // Get total count for pagination
    const totalPages = await prisma.user.count({ where })

    return NextResponse.json({
      users,
      pagination: {
        page,
        total: Math.ceil(totalPages / limit),
        limit,
        totalPages: Math.ceil(totalPages / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
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
    if (!data.name || !data.email || !data.password || !data.role) {
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
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        isVerified: data.isVerified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

