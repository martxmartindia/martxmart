'use server'
import { prisma } from "@/lib/prisma"
export async function getProducts({
  page = 1,
  limit = 12,
  category,
  sort = "newest",
  minPrice,
  maxPrice,
  search,
}: {
  page: number
  limit: number
  category?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}) {
  const skip = (page - 1) * limit

  // Build where conditions
  const where: any = {
    isDeleted: false,
  }

  if (category) {
    where.categoryId = category
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}

    if (minPrice !== undefined) {
      where.price.gte = minPrice
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ]
  }

  // Build order by
  let orderBy: any = { createdAt: "desc" }

  switch (sort) {
    case "price-low":
      orderBy = { price: "asc" }
      break
    case "price-high":
      orderBy = { price: "desc" }
      break
    case "rating":
      orderBy = { averageRating: "desc" }
      break
    default:
      orderBy = { createdAt: "desc" }
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
    orderBy,
    skip,
    take: limit,
  })

  // Get total count for pagination
  const total = await prisma.product.count({ where })

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  })

  if (!product) return null

  return {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
    gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
    weight: product.weight ? Number(product.weight) : null,
    discount: product.discount ? Number(product.discount) : null,
    reviews: product.reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString()
    }))
  }
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: {
      featured: true,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return products.map(product => ({
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
    gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
    weight: product.weight ? Number(product.weight) : null,
    discount: product.discount ? Number(product.discount) : null,
  }))
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  })
}

