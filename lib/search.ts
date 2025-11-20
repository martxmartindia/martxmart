import { prisma } from "@/lib/prisma"
import { searchProducts as elasticSearch, getSuggestions as elasticSuggestions } from "@/lib/elasticsearch"

export async function searchProducts(query: string, filters: any = {}, page = 1, limit = 24) {
  if (!query || query.trim() === "") {
    return { products: [], total: 0, brands: [] }
  }

  // Skip Elasticsearch for now due to configuration issues
  // Will use database search directly

  // Fallback to database search
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ],
      isDeleted: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      averageRating: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  })

  const total = await prisma.product.count({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ],
      isDeleted: false,
    },
  })

  return { products, total, brands: [], categories: [], priceRanges: [] }
}

export async function getSearchSuggestions(query: string, limit = 5) {
  if (!query || query.trim() === "") {
    return []
  }

  // Skip Elasticsearch for now due to configuration issues
  // Will fall back to database search directly

  // Single database query for better performance
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } }
      ],
      isDeleted: false,
    },
    select: {
      name: true,
      brand: true,
      category: { select: { name: true } }
    },
    take: limit * 2,
    orderBy: {
      averageRating: 'desc'
    }
  })

  // Extract unique suggestions with priority
  const suggestions = new Set<string>()
  
  // Add exact name matches first
  products.forEach(p => {
    if (p.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(p.name)
    }
  })
  
  // Add brand matches
  products.forEach(p => {
    if (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(p.brand)
    }
  })
  
  // Add category matches
  products.forEach(p => {
    if (p.category?.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(p.category.name)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}

