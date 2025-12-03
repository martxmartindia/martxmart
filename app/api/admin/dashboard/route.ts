import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper function to generate sales data
function generateSalesData(months: number) {
  const data = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    data.push({
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: Math.floor(Math.random() * 100000) + 50000,
      orders: Math.floor(Math.random() * 100) + 50,
    })
  }
  return data
}

// Helper function to generate user growth data
function generateUserGrowthData(months: number) {
  const data = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    data.push({
      date: date.toLocaleString('default', { month: 'short' }),
      customers: Math.floor(Math.random() * 50) + 20,
      vendors: Math.floor(Math.random() * 10) + 5,
      authors: Math.floor(Math.random() * 5) + 2,
      franchises: Math.floor(Math.random() * 3) + 1,
      suppliers: Math.floor(Math.random() * 4) + 2,
    })
  }
  return data
}

// Helper function to generate system logs
function generateSystemLogs(count: number) {
  const levels = ['info', 'warning', 'error', 'success']
  const sources = ['System', 'Database', 'API', 'Auth', 'Orders', 'Products']
  const data = []

  for (let i = 0; i < count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000))

    data.push({
      id: `log-${i + 1}`,
      level,
      source,
      timestamp,
      message: `${source} ${level === 'error' ? 'encountered an error' : level === 'warning' ? 'needs attention' : 'is operating normally'}`,
      details: `Detailed information about the ${source.toLowerCase()} ${level}`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    })
  }

  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export async function GET(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get("range") || "7days"

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    const previousPeriodStart = new Date(startDate)

    switch (timeRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0)
        previousPeriodStart.setDate(startDate.getDate() - 1)
        break
      case "7days":
        startDate.setDate(endDate.getDate() - 7)
        previousPeriodStart.setDate(startDate.getDate() - 7)
        break
      case "30days":
        startDate.setDate(endDate.getDate() - 30)
        previousPeriodStart.setDate(startDate.getDate() - 30)
        break
      case "90days":
        startDate.setDate(endDate.getDate() - 90)
        previousPeriodStart.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
        previousPeriodStart.setDate(startDate.getDate() - 7)
    }

    // Fetch metrics with error handling
    const [userMetrics, businessMetrics, recentData] = await Promise.allSettled([
      // User metrics
      Promise.all([
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.user.count({ where: { role: "CUSTOMER", isDeleted: false } }),
        prisma.vendorProfile.count(),
        prisma.author.count(),
        prisma.franchise.count(),
        prisma.supplier.count(),
        prisma.user.count({
          where: {
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            isDeleted: false,
          },
        }),
      ]),
      // Business metrics
      Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.product.count({ where: { stock: { lt: 10 } } }),
        prisma.category.count(),
        prisma.blog.count(),
      ]),
      // Recent data
      Promise.all([
        prisma.user.findMany({
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        }),
        prisma.order.findMany({
          where: {
            status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
            createdAt: { gte: startDate, lte: endDate },
          },
          select: { totalAmount: true },
        }),
        prisma.order.findMany({
          where: {
            status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
            createdAt: { gte: previousPeriodStart, lte: startDate },
          },
          select: { totalAmount: true },
        }),
      ]),
    ])

    // Handle potential errors and set default values
    const [
      totalUsers = 0,
      totalCustomers = 0,
      totalVendors = 0,
      totalAuthors = 0,
      totalFranchises = 0,
      totalSuppliers = 0,
      newUsersToday = 0,
    ] = userMetrics.status === "fulfilled" ? userMetrics.value : Array(7).fill(0)

    const [
      totalOrders = 0,
      totalProducts = 0,
      pendingOrders = 0,
      lowStockProducts = 0,
      totalCategories = 0,
      totalBlogs = 0,
    ] = businessMetrics.status === "fulfilled" ? businessMetrics.value : Array(6).fill(0)

    const [recentUsers = [], currentOrders = [], previousOrders = []] =
      recentData.status === "fulfilled" ? recentData.value : [[], [], []]

    // Calculate revenue and growth rates safely
    const totalRevenue = currentOrders.reduce((sum, order) => Number(sum) + Number(order.totalAmount), 0)
    const previousPeriodRevenue = previousOrders.reduce((sum, order) => Number(sum) + Number(order.totalAmount), 0)

    const revenueGrowthRate =
      previousPeriodRevenue === 0
        ? Math.round(totalRevenue * 100) / 100
        : Math.round(((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100)

    // Calculate user growth rate
    const usersInCurrentPeriod = await prisma.user.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        isDeleted: false,
      },
    })

    const usersInPreviousPeriod = await prisma.user.count({
      where: {
        createdAt: { gte: previousPeriodStart, lte: startDate },
        isDeleted: false,
      },
    })

    const userGrowthRate =
      usersInPreviousPeriod === 0
        ? usersInCurrentPeriod * 100
        : Math.round(((usersInCurrentPeriod - usersInPreviousPeriod) / usersInPreviousPeriod) * 100)

    // Generate chart data
    const userTypeDistribution = [
      { name: "Customers", value: totalCustomers },
      { name: "Vendors", value: totalVendors },
      { name: "Authors", value: totalAuthors },
      { name: "Franchises", value: totalFranchises },
      { name: "Suppliers", value: totalSuppliers },
    ]

    const salesByMonth = generateSalesData(6)
    const userGrowthByType = generateUserGrowthData(6)
    const revenueByUserType = [
      { name: "Customers", revenue: Math.round(totalRevenue * 0.6) },
      { name: "Franchises", revenue: Math.round(totalRevenue * 0.25) },
      { name: "Vendors", revenue: Math.round(totalRevenue * 0.15) },
    ]

    // Generate system logs
    const systemLogs = generateSystemLogs(10)

    return NextResponse.json({
      // User metrics
      totalUsers,
      totalCustomers,
      totalVendors,
      totalAuthors,
      totalFranchises,
      totalSuppliers,
      newUsersToday,
      userGrowthRate,

      // Business metrics
      totalOrders,
      totalRevenue,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      totalCategories,
      totalBlogs,
      revenueGrowthRate,

      // System metrics
      systemHealth: 95,
      serverUptime: "99.9%",
      errorRate: "0.2%",
      pendingIssues: 3,

      // Chart data
      salesByMonth,
      userTypeDistribution,
      userGrowthByType,
      revenueByUserType,

      // Recent data
      recentUsers,
      systemLogs,
    })
  } catch (error) {
    console.error("Error in dashboard API:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}

