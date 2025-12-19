import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { OrderStatus } from "@/types"
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
    const range = searchParams.get("range") || "30" // days

    const days = parseInt(range)

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      // Return default analytics data matching frontend interface
      return NextResponse.json({
        revenue: { current: 0, previous: 0, change: 0, data: [] },
        orders: { current: 0, previous: 0, change: 0, data: [] },
        customers: { current: 0, previous: 0, change: 0 },
        products: { current: 0, previous: 0, change: 0 },
        topProducts: [],
        categoryBreakdown: [],
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          totalQuantity: 0,
          averageOrderValue: 0,
          period: `${days} days`,
        },
        salesTrend: [],
        lowStockProducts: [],
        ordersByStatus: {},
      })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get summary statistics
    const totalRevenueData = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      },
      _sum: {
        price: true
      },
      _count: {
        id: true
      }
    })

    const totalQuantityData = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      },
      _sum: {
        quantity: true
      }
    })

    const totalRevenue = parseFloat((totalRevenueData._sum.price || 0).toString())
    const totalOrders = totalRevenueData._count.id || 0
    const totalQuantity = totalQuantityData._sum.quantity || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const summary = {
      totalRevenue,
      totalOrders,
      totalQuantity,
      averageOrderValue,
      period: `${days} days`,
    }

    // Generate sales trend data (daily for the specified range)
    const salesTrend = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayData = await prisma.productOrderItem.aggregate({
        where: {
          product: {
            VendorProfile: {
              some: {
                id: vendorProfile.id
              }
            }
          },
          order: {
            status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        },
        _sum: {
          price: true
        },
        _count: {
          id: true
        }
      })

      salesTrend.unshift({
        date: date.toISOString().split('T')[0],
        revenue: parseFloat((dayData._sum.price || 0).toString()),
        orders: dayData._count.id || 0,
      })
    }

    // Get top products
    const topProductsData = await prisma.productOrderItem.groupBy({
      by: ['productId'],
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      },
      _sum: {
        quantity: true,
        price: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    const topProducts = []
    for (const item of topProductsData) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          images: true
        }
      })

      if (product) {
        topProducts.push({
          id: product.id,
          name: product.name,
          image: product.images?.[0] || null,
          totalSold: item._sum.quantity || 0,
          revenue: parseFloat((item._sum.price || 0).toString()),
          orders: item._count.id || 0,
        })
      }
    }

    // Get low stock products
    const lowStockProductsData = await prisma.product.findMany({
      where: {
        VendorProfile: {
          some: {
            id: vendorProfile.id
          }
        },
        stock: {
          lte: 10
        },
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        images: true
      },
      orderBy: {
        stock: 'asc'
      },
      take: 5
    })

    const lowStockProducts = lowStockProductsData.map(product => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      price: parseFloat(product.price.toString()),
      image: product.images?.[0] || null,
    }))

    // Get orders by status
    const ordersByStatusData = await prisma.order.groupBy({
      by: ['status'],
      where: {
        items: {
          some: {
            product: {
              VendorProfile: {
                some: {
                  id: vendorProfile.id
                }
              }
            }
          }
        }
      },
      _count: {
        id: true
      }
    })

    const ordersByStatus: { [key in OrderStatus]?: number } = {}
    ordersByStatusData.forEach(item => {
      ordersByStatus[item.status] = item._count.id
    })

    const analytics = {
      summary,
      salesTrend,
      topProducts,
      lowStockProducts,
      ordersByStatus,
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error("Error fetching vendor analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}