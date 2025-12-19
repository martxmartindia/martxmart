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
    const status = searchParams.get("status") || ""

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ message: "Invalid pagination parameters" }, { status: 400 })
    }

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      // Return empty payouts list instead of 404
      return NextResponse.json({
        payouts: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      })
    }

    // Generate payout periods (last 6 months)
    const payoutPeriods = []
    const now = new Date()

    for (let i = 0; i < 6; i++) {
      const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      // Get delivered orders in this period
      const periodOrders = await prisma.productOrderItem.findMany({
        where: {
          product: {
            VendorProfile: {
              some: {
                id: vendorProfile.id
              }
            }
          },
          order: {
            status: 'DELIVERED',
            createdAt: {
              gte: periodStart,
              lte: periodEnd
            }
          }
        },
        include: {
          order: {
            select: {
              id: true,
              createdAt: true
            }
          }
        }
      })

      const totalAmount = periodOrders.reduce((sum, item) => {
        return sum + (parseFloat(item.price.toString()) * item.quantity * 0.95) // 95% to vendor
      }, 0)

      const orderIds = [...new Set(periodOrders.map(item => item.order.id))]

      if (totalAmount > 0) {
        payoutPeriods.push({
          id: `POUT-${periodStart.getFullYear()}${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
          reference: `PAY-${periodStart.getFullYear()}${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
          amount: totalAmount,
          status: i === 0 ? "PENDING" : "COMPLETED", // Current month is pending
          createdAt: periodEnd.toISOString(),
          processedAt: i === 0 ? null : new Date(periodEnd.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "Bank Transfer",
          transactionId: i === 0 ? null : `TXN${Date.now().toString().slice(-8)}`,
          salesCount: orderIds.length,
          orderIds: orderIds,
          period: `${periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${periodStart.getFullYear()}`
        })
      }
    }

    // Filter by status if provided
    let filteredPayouts = payoutPeriods
    if (status && status !== 'all') {
      filteredPayouts = payoutPeriods.filter(p => p.status === status.toUpperCase())
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex)

    return NextResponse.json({
      payouts: paginatedPayouts,
      pagination: {
        total: filteredPayouts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPayouts.length / limit),
      },
    })

  } catch (error) {
    console.error("Error fetching vendor payouts:", error)
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 })
  }
}