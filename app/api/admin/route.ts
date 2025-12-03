import { NextResponse } from "next/server"
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

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const isVerified = searchParams.get("isVerified")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { businessType: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (isVerified) {
      where.isVerified = isVerified === "true"
    }

    // Get vendors with pagination
    const vendors = await prisma.vendorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            Product:true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    // Get total count for pagination
    const total = await prisma.vendorProfile.count({ where })

    return NextResponse.json({
      vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role

    if (userRole !== "ADMIN" && userRole !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Admin or Vendor role required." }, { status: 403 })
    }

    const { businessName, businessType, gstin, panNumber } = await req.json()

    if (!businessName || !businessType) {
      return NextResponse.json({ error: "Business name and type are required" }, { status: 400 })
    }

    // Check if user already has a vendor profile
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId: userId as string },
    })

    if (existingProfile) {
      return NextResponse.json({ error: "Vendor profile already exists" }, { status: 400 })
    }

    // Create vendor profile
    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: userId as string,
        businessName,
        businessType,
        gstNumber: gstin,
        panNumber,
        isVerified: userRole === "ADMIN", // Auto-verify if admin is creating
      },
    })

    // Update user role to VENDOR if not already
    if (userRole !== "ADMIN") {
      await prisma.user.update({
        where: { id: userId as string },
        data: { role: "VENDOR" },
      })
    }

    return NextResponse.json(vendorProfile, { status: 201 })
  } catch (error) {
    console.error("Error creating vendor profile:", error)
    return NextResponse.json({ error: "Failed to create vendor profile" }, { status: 500 })
  }
}

