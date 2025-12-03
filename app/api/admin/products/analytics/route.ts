import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date for monthly calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all analytics data in parallel
    const [
      totalProducts,
      featuredProducts,
      lowStockProducts,
      newProductsThisMonth,
      averagePrice,
      priceRange,
      topCategories,
      stockDistribution,
      recentProducts
    ] = await Promise.all([
      // Total products
      prisma.product.count({
        where: { isDeleted: false }
      }),

      // Featured products
      prisma.product.count({
        where: { isDeleted: false, featured: true }
      }),

      // Low stock products (≤ 10)
      prisma.product.count({
        where: { isDeleted: false, stock: { lte: 10 } }
      }),

      // New products this month
      prisma.product.count({
        where: {
          isDeleted: false,
          createdAt: { gte: startOfMonth }
        }
      }),

      // Average price
      prisma.product.aggregate({
        where: { isDeleted: false },
        _avg: { price: true }
      }),

      // Price range
      prisma.product.aggregate({
        where: { isDeleted: false },
        _min: { price: true },
        _max: { price: true }
      }),

      // Top categories
      prisma.category.findMany({
        where: {
          products: {
            some: { isDeleted: false }
          }
        },
        include: {
          _count: {
            select: {
              products: {
                where: { isDeleted: false }
              }
            }
          }
        },
        orderBy: {
          products: {
            _count: 'desc'
          }
        },
        take: 5
      }),

      // Stock distribution
      Promise.all([
        prisma.product.count({
          where: { isDeleted: false, stock: { gt: 10 } }
        }),
        prisma.product.count({
          where: { isDeleted: false, stock: { gte: 1, lte: 10 } }
        }),
        prisma.product.count({
          where: { isDeleted: false, stock: 0 }
        })
      ]),

      // Recent products
      prisma.product.findMany({
        where: { isDeleted: false },
        include: {
          category: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Transform data
    const analytics = {
      totalProducts,
      featuredProducts,
      lowStockProducts,
      newProductsThisMonth,
      averagePrice: averagePrice._avg.price ? Number(averagePrice._avg.price) : 0,
      priceRange: {
        min: priceRange._min.price ? Number(priceRange._min.price) : 0,
        max: priceRange._max.price ? Number(priceRange._max.price) : 0
      },
      topCategories: topCategories.map(category => ({
        id: category.id,
        name: category.name,
        count: category._count.products
      })),
      stockDistribution: {
        inStock: stockDistribution[0],
        lowStock: stockDistribution[1],
        outOfStock: stockDistribution[2]
      },
      recentProducts: recentProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        category: product.category,
        createdAt: product.createdAt.toISOString()
      }))
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}