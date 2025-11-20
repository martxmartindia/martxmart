import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "12")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const categoryId = searchParams.get("categoryId")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const brands = searchParams.getAll("brand")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { tags: { contains: query, mode: "insensitive" } },
      ],
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price.gte = Number(minPrice)
      if (maxPrice) whereClause.price.lte = Number(maxPrice)
    }

    if (brands.length > 0) {
      whereClause.brand = { in: brands }
    }

    // Get products
    const products = await db.shopping.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    })

    // Get total count
    const totalProducts = await db.shopping.count({
      where: whereClause,
    })

    // Get filters
    const allBrands = await db.shopping.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { brand: true },
      distinct: ["brand"],
    })

    const categories = await db.category.findMany({
      where: {
        shopping: {
          some: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { brand: { contains: query, mode: "insensitive" } },
            ],
          },
        },
      },
      include: {
        _count: {
          select: { shopping: true },
        },
      },
    })

    const filters = {
      brands: allBrands.map((b) => b.brand).filter(Boolean),
      categories,
    }

    return NextResponse.json({
      query,
      products,
      filters,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    })
  } catch (error) {
    console.error("Error searching products:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
