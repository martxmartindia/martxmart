import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-helpers"

export async function GET(req: Request) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.id

    // Get vendor ID
    const vendor = await prisma.vendorProfile.findUnique({
      where: { userId: userId as string},
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const categoryId = searchParams.get("categoryId") || undefined
    const search = searchParams.get("search") || undefined

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      vendorId: vendor.id,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
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
    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.id

    // Get vendor ID
    const vendor = await prisma.vendorProfile.findUnique({
      where: { userId: userId as string },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Get request body
    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    // Check if slug is unique
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: userId as string,
        name: data.name as string,
      },
    });

    if (existingProduct) {
      return NextResponse.json({ error: "Product with similar name already exists" }, { status: 400 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        // slug,
        description: data.description,
        price: data.price,
        hsnCode: data.hsnCode,
        stock: data.stock || 0,
        images: data.images || [],
        categoryId: data.categoryId,
        brand: data.brand,
        modelNumber: data.modelNumber,
        dimensions: data.dimensions,
        weight: data.weight,
        warranty: data.warranty,
        featured: false, // Only admin can set featured
        // isActive: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

