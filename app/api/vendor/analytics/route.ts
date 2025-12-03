import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) { 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get vendor ID
    const vendor = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get("timeRange") || "month"
    const comparison = searchParams.get("comparison") || "previous"

    // Calculate date ranges
    const now = new Date()
    const currentStartDate = new Date()
    const previousStartDate = new Date()
    let dateFormat = ""

    switch (timeRange) {
      case "week":
        currentStartDate.setDate(now.getDate() - 7)
        previousStartDate.setDate(currentStartDate.getDate() - 7)
        dateFormat = "day"
        break
      case "month":
        currentStartDate.setMonth(now.getMonth() - 1)
        if (comparison === "previous") {
          previousStartDate.setMonth(currentStartDate.getMonth() - 1)
        } else {
          previousStartDate.setFullYear(currentStartDate.getFullYear() - 1)
        }
        dateFormat = "day"
        break
      case "quarter":
        currentStartDate.setMonth(now.getMonth() - 3)
        if (comparison === "previous") {
          previousStartDate.setMonth(currentStartDate.getMonth() - 3)
        } else {
          previousStartDate.setFullYear(currentStartDate.getFullYear() - 1)
        }
        dateFormat = "month"
        break
      case "year":
        currentStartDate.setFullYear(now.getFullYear() - 1)
        if (comparison === "previous") {
          previousStartDate.setFullYear(currentStartDate.getFullYear() - 1)
        } else {
          previousStartDate.setFullYear(currentStartDate.getFullYear() - 1)
        }
        dateFormat = "month"
        break
      default:
        currentStartDate.setMonth(now.getMonth() - 1)
        previousStartDate.setMonth(currentStartDate.getMonth() - 1)
        dateFormat = "day"
    }

    // In a real application, you would query the database for actual analytics data
    // For this example, we'll generate sample data

    // Revenue data
    const currentRevenue = Math.floor(Math.random() * 500000) + 100000
    const previousRevenue = Math.floor(Math.random() * 500000) + 100000
    const revenuePercentChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100

    // Orders data
    const currentOrders = Math.floor(Math.random() * 1000) + 200
    const previousOrders = Math.floor(Math.random() * 1000) + 200
    const ordersPercentChange = ((currentOrders - previousOrders) / previousOrders) * 100

    // Average order value
    const currentAOV = currentRevenue / currentOrders
    const previousAOV = previousRevenue / previousOrders
    const aovPercentChange = ((currentAOV - previousAOV) / previousAOV) * 100

    // Conversion rate
    const currentConversionRate = Math.random() * 5 + 1
    const previousConversionRate = Math.random() * 5 + 1
    const conversionRatePercentChange =
      ((currentConversionRate - previousConversionRate) / previousConversionRate) * 100

    // Generate revenue trend data
    const revenueTrend = []
    if (dateFormat === "day") {
      // Daily data
      const days = timeRange === "week" ? 7 : 30
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}`

        revenueTrend.push({
          date: dateStr,
          current: Math.floor(Math.random() * 20000) + 5000,
          previous: Math.floor(Math.random() * 20000) + 5000,
        })
      }
    } else {
      // Monthly data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      for (let i = 0; i < 12; i++) {
        revenueTrend.push({
          date: months[i],
          current: Math.floor(Math.random() * 100000) + 20000,
          previous: Math.floor(Math.random() * 100000) + 20000,
        })
      }
    }

    // Generate orders trend data
    const ordersTrend = []
    if (dateFormat === "day") {
      // Daily data
      const days = timeRange === "week" ? 7 : 30
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}`

        ordersTrend.push({
          date: dateStr,
          current: Math.floor(Math.random() * 50) + 10,
          previous: Math.floor(Math.random() * 50) + 10,
        })
      }
    } else {
      // Monthly data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      for (let i = 0; i < 12; i++) {
        ordersTrend.push({
          date: months[i],
          current: Math.floor(Math.random() * 200) + 50,
          previous: Math.floor(Math.random() * 200) + 50,
        })
      }
    }

    // Top products data
    const topProducts = [
      { name: "Smartphone X Pro", revenue: Math.floor(Math.random() * 50000) + 10000 },
      { name: "Wireless Earbuds", revenue: Math.floor(Math.random() * 40000) + 8000 },
      { name: "Smart Watch Series 5", revenue: Math.floor(Math.random() * 30000) + 6000 },
      { name: "Laptop Ultra Slim", revenue: Math.floor(Math.random() * 25000) + 5000 },
      { name: "Bluetooth Speaker", revenue: Math.floor(Math.random() * 20000) + 4000 },
      { name: "Gaming Console", revenue: Math.floor(Math.random() * 15000) + 3000 },
      { name: "Fitness Tracker", revenue: Math.floor(Math.random() * 10000) + 2000 },
    ]

    // Sales by category data
    const salesByCategory = [
      { name: "Electronics", value: Math.floor(Math.random() * 200000) + 50000 },
      { name: "Clothing", value: Math.floor(Math.random() * 150000) + 40000 },
      { name: "Home & Kitchen", value: Math.floor(Math.random() * 100000) + 30000 },
      { name: "Beauty", value: Math.floor(Math.random() * 80000) + 20000 },
      { name: "Sports", value: Math.floor(Math.random() * 60000) + 10000 },
    ]

    // Customer acquisition data
    const newCustomers = Math.floor(Math.random() * 500) + 100
    const returningCustomers = Math.floor(Math.random() * 300) + 50
    const customerAcquisition = [
      { name: "New Customers", value: newCustomers },
      { name: "Returning Customers", value: returningCustomers },
    ]

    // Traffic sources data
    const trafficSources = [
      { name: "Direct", value: Math.floor(Math.random() * 40) + 10 },
      { name: "Search", value: Math.floor(Math.random() * 30) + 20 },
      { name: "Social", value: Math.floor(Math.random() * 20) + 5 },
      { name: "Referral", value: Math.floor(Math.random() * 15) + 5 },
      { name: "Email", value: Math.floor(Math.random() * 10) + 5 },
    ]

    // Device distribution data
    const deviceDistribution = [
      { name: "Mobile", value: Math.floor(Math.random() * 60) + 30 },
      { name: "Desktop", value: Math.floor(Math.random() * 40) + 20 },
      { name: "Tablet", value: Math.floor(Math.random() * 20) + 5 },
    ]

    return NextResponse.json({
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        percentChange: revenuePercentChange,
      },
      orders: {
        current: currentOrders,
        previous: previousOrders,
        percentChange: ordersPercentChange,
      },
      averageOrderValue: {
        current: currentAOV,
        previous: previousAOV,
        percentChange: aovPercentChange,
      },
      conversionRate: {
        current: currentConversionRate,
        previous: previousConversionRate,
        percentChange: conversionRatePercentChange,
      },
      revenueTrend,
      ordersTrend,
      topProducts,
      salesByCategory,
      customerAcquisition,
      trafficSources,
      deviceDistribution,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

