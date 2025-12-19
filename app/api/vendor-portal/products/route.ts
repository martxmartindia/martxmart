import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const stock = searchParams.get("stock") || ""

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ message: "Invalid pagination parameters" }, { status: 400 })
    }

    // Get vendor profile first
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      // Return empty products list instead of 404
      return NextResponse.json({
        products: [],
        totalPages: 0,
        total: 0,
        page: 1,
        limit: 10
      })
    }

    // Build where clause for filtering
    const where: any = {
      VendorProfile: {
        some: {
          id: vendorProfile.id
        }
      }
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { modelNumber: { contains: search, mode: 'insensitive' } },
        { hsnCode: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add stock filter
    if (stock && stock !== 'all') {
      if (stock === 'in_stock') {
        where.stock = { gt: 10 }
      } else if (stock === 'low_stock') {
        where.AND = [
          { stock: { gt: 0 } },
          { stock: { lte: 10 } }
        ]
      } else if (stock === 'out_of_stock') {
        where.stock = 0
      }
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            name: true
          }
        },
        VendorProfile: {
          select: {
            id: true,
            businessName: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format products for frontend
    const formattedProducts = products.map(product => {
      const vendorPrice = parseFloat(product.price.toString())
      const platformPrice = vendorPrice * 1.05 // 5% markup

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        vendorPrice: vendorPrice,
        platformPrice: platformPrice,
        price: vendorPrice, // Keep for compatibility
        stock: product.stock,
        category: product.category?.name || "Uncategorized",
        status: product.isDeleted ? "INACTIVE" : "APPROVED",
        approvalStatus: product.isDeleted ? "REJECTED" : "APPROVED",
        sku: product.modelNumber || `SKU-${product.id.slice(-6)}`,
        brand: product.brand,
        modelNumber: product.modelNumber,
        hsnCode: product.hsnCode,
        images: product.images || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        specifications: product.specifications
      }
    })

    // Apply status filter after fetching (since we don't have approvalStatus in schema)
    let filteredProducts = formattedProducts
    if (status && status !== 'all') {
      filteredProducts = formattedProducts.filter(product =>
        product.status === status.toUpperCase() || product.approvalStatus === status.toUpperCase()
      )
    }

    return NextResponse.json({
      products: filteredProducts,
      totalPages: Math.ceil(total / limit),
      total: total,
      page,
      limit
    })

  } catch (error) {
    console.error("Error fetching vendor products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id
    const data = await req.json()

    // Validate required fields
    const { name, description, price, stock, categoryId, brand, modelNumber, hsnCode, images, specifications } = data

    if (!name || !price || !categoryId) {
      return NextResponse.json({
        error: "Missing required fields: name, price, categoryId"
      }, { status: 400 })
    }

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if product with similar name already exists for this vendor
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        },
        VendorProfile: {
          some: {
            id: vendorProfile.id
          }
        }
      }
    })

    if (existingProduct) {
      return NextResponse.json({
        error: "A product with similar name already exists for your vendor account"
      }, { status: 400 })
    }

    // Create new product in database
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId,
        brand: brand || null,
        modelNumber: modelNumber || null,
        hsnCode: hsnCode || "",
        images: images || [],
        specifications: specifications || "",
        VendorProfile: {
          connect: { id: vendorProfile.id }
        }
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        VendorProfile: {
          select: {
            id: true,
            businessName: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Product created successfully",
      product: {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
        category: newProduct.category?.name,
        status: newProduct.isDeleted ? "INACTIVE" : "ACTIVE",
        images: newProduct.images,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating vendor product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}