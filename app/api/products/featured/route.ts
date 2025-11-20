import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const skip = (page - 1) * limit

    // Fetch featured products with pagination
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        isDeleted: false,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate average rating for each product and serialize Decimal fields
    const productsWithRating = products.map((product) => {
      const ratings = product.reviews.map((review: { rating: number }) => review.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
        : undefined

      return {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
        gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
        weight: product.weight ? Number(product.weight) : null,
        discount: product.discount ? Number(product.discount) : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        discountStartDate: product.discountStartDate?.toISOString() ?? null,
        discountEndDate: product.discountEndDate?.toISOString() ?? null,
        reviews: undefined, // Remove reviews array from response
        averageRating,
        reviewCount: ratings.length,
      }
    })

    // Get total count for pagination
    const totalCount = await prisma.product.count({
      where: {
        featured: true,
        isDeleted: false,
      },
    })

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}