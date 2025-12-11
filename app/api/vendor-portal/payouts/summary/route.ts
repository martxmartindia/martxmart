import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

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

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Calculate payout summary based on sales data
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const lastMonth = new Date(currentMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const startOfYear = new Date(currentMonth.getFullYear(), 0, 1)

    // Get current month sales for this vendor
    const currentMonthSales = await prisma.productOrderItem.aggregate({
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
          createdAt: { gte: currentMonth }
        }
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      }
    })

    // Get last month sales for this vendor
    const lastMonthSales = await prisma.productOrderItem.aggregate({
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
            gte: lastMonth,
            lt: currentMonth
          }
        }
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      }
    })

    // Get all-time sales for this vendor
    const allTimeSales = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        }
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      }
    })

    // Get year-to-date sales for this vendor
    const yearToDateSales = await prisma.productOrderItem.aggregate({
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
          createdAt: { gte: startOfYear }
        }
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      }
    })

    // Get pending payouts (orders that are delivered but not yet paid out)
    const pendingPayouts = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: 'DELIVERED'
        }
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      }
    })

    // Get top product for this vendor
    const topProduct = await prisma.productOrderItem.groupBy({
      by: ['productId'],
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        }
      },
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 1
    })

    let topProductName = "No sales yet"
    if (topProduct.length > 0) {
      const product = await prisma.product.findUnique({
        where: { id: topProduct[0].productId },
        select: { name: true }
      })
      topProductName = product?.name || "Unknown Product"
    }

    // Calculate platform fee (5%)
    const currentMonthRevenue = parseFloat((currentMonthSales._sum.price || 0).toString())
    const lastMonthRevenue = parseFloat((lastMonthSales._sum.price || 0).toString())
    const allTimeRevenue = parseFloat((allTimeSales._sum.price || 0).toString())
    const yearToDateRevenue = parseFloat((yearToDateSales._sum.price || 0).toString())
    const pendingRevenue = parseFloat((pendingPayouts._sum.price || 0).toString())

    const platformFeeCurrent = currentMonthRevenue * 0.05
    const platformFeeLast = lastMonthRevenue * 0.05
    const platformFeeAllTime = allTimeRevenue * 0.05
    const platformFeeYearToDate = yearToDateRevenue * 0.05

    // Calculate vendor earnings
    const vendorEarningsCurrent = currentMonthRevenue - platformFeeCurrent
    const vendorEarningsLast = lastMonthRevenue - platformFeeLast
    const vendorEarningsAllTime = allTimeRevenue - platformFeeAllTime
    const vendorEarningsYearToDate = yearToDateRevenue - platformFeeYearToDate
    const vendorEarningsPending = pendingRevenue * 0.95 // 95% goes to vendor

    // Calculate growth percentage
    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    const summary = {
      currentMonth: {
        sales: currentMonthRevenue,
        platformFee: platformFeeCurrent,
        vendorEarnings: vendorEarningsCurrent,
        orders: currentMonthSales._count.id,
      },
      lastMonth: {
        sales: lastMonthRevenue,
        platformFee: platformFeeLast,
        vendorEarnings: vendorEarningsLast,
        orders: lastMonthSales._count.id,
      },
      pendingPayouts: {
        count: pendingPayouts._count.id,
        amount: vendorEarningsPending,
      },
      totalEarnings: {
        allTime: vendorEarningsAllTime,
        thisYear: vendorEarningsYearToDate,
      },
      stats: {
        averageOrderValue: currentMonthSales._count.id > 0
          ? (currentMonthRevenue / currentMonthSales._count.id)
          : 0,
        conversionRate: 0, // Would need additional tracking data
        topProduct: topProductName,
        monthlyGrowth: monthlyGrowth,
      }
    }

    return NextResponse.json(summary)

  } catch (error) {
    console.error("Error fetching payout summary:", error)
    return NextResponse.json({ error: "Failed to fetch payout summary" }, { status: 500 })
  }
}