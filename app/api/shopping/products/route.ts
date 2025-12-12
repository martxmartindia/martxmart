import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Handle search suggestions
    if (searchParams.get('suggestions') === 'true') {
      const query = searchParams.get('q') || ''
      if (query.length < 2) {
        return NextResponse.json({ suggestions: [] })
      }
      
      const suggestions = await db.shopping.findMany({
        where: {
          isDeleted: false,
          isAvailable: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
          ]
        },
        select: {
          name: true,
          brand: true,
        },
        take: 8,
      })
      
      const uniqueSuggestions = Array.from(new Set([
        ...suggestions.map(s => s.name),
        ...suggestions.map(s => s.brand).filter(Boolean)
      ])).slice(0, 6)
      
      return NextResponse.json({ suggestions: uniqueSuggestions })
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get("search")
    const categories = searchParams.getAll("category")
    const brands = searchParams.getAll("brand")
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "999999")
    const minRating = Number.parseFloat(searchParams.get("minRating") || "0")
    const inStock = searchParams.get("inStock") === "true"
    const onSale = searchParams.get("onSale") === "true"
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build where clause
    const where: any = {
      isDeleted: false,
      isAvailable: true,
    }

    if (search) {
      const searchTerms = search.split(' ').filter(term => term.length > 0)
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        // Search individual words
        ...searchTerms.map(term => ({
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { brand: { contains: term, mode: "insensitive" } },
          ]
        }))
      ]
    }

    if (categories.length > 0) {
      where.categoryId = {
        in: categories,
      }
    }

    if (brands.length > 0) {
      where.brand = { in: brands }
    }

    if (onSale) {
      where.originalPrice = { gt: where.price || 0 }
    }

    where.price = {
      gte: minPrice,
      lte: maxPrice,
    }

    if (minRating > 0) {
      where.averageRating = { gte: minRating }
    }

    if (inStock) {
      where.stock = { gt: 0 }
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Fetch products and filters data
    const [products, total, filtersData] = await Promise.all([
      db.shopping.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.shopping.count({ where }),
      // Get filter options
      Promise.all([
        // Get available brands
        db.shopping.findMany({
          where: { isDeleted: false, isAvailable: true },
          select: { brand: true },
          distinct: ['brand'],
        }),
        // Get available categories with product counts
        db.category.findMany({
          where: {
            shopping: {
              some: {
                isDeleted: false,
                isAvailable: true,
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                shopping: {
                  where: {
                    isDeleted: false,
                    isAvailable: true,
                  },
                },
              },
            },
          },
        }),
        // Get price range
        db.shopping.aggregate({
          where: { isDeleted: false, isAvailable: true },
          _min: { price: true },
          _max: { price: true },
        }),
      ]),
    ])

    const [brandsData, categoriesData, priceRange] = filtersData
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        averageRating: product.averageRating ? Number(product.averageRating) : 0,
      })),
      filters: {
        brands: brandsData.map(b => b.brand).filter(Boolean),
        categories: categoriesData,
        priceRange: {
          min: Number(priceRange._min.price) || 0,
          max: Number(priceRange._max.price) || 10000,
        },
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
