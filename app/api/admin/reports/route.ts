import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"
export async function GET(req: Request) {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const reportType = searchParams.get("type") || "sales"
    const timeRange = searchParams.get("range") || "30days"

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "7days":
        startDate.setDate(endDate.getDate() - 7)
        break
      case "30days":
        startDate.setDate(endDate.getDate() - 30)
        break
      case "90days":
        startDate.setDate(endDate.getDate() - 90)
        break
      case "year":
        startDate.setDate(endDate.getDate() - 365)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // Generate mock data based on report type
    // In a real implementation, this would query the database
    let responseData: any = {}

    if (reportType === "sales" || reportType === "all") {
      // Generate sales data
      const salesData = generateSalesData(startDate, endDate)
      const paymentMethodData = [
        { name: "Credit Card", value: 45 },
        { name: "UPI", value: 30 },
        { name: "Cash on Delivery", value: 15 },
        { name: "Net Banking", value: 10 },
      ]
      const orderStatusData = [
        { name: "Delivered", value: 60 },
        { name: "Shipped", value: 15 },
        { name: "Processing", value: 20 },
        { name: "Cancelled", value: 5 },
      ]
      const salesByDayData = [
        { day: "Monday", revenue: 12000, orders: 45 },
        { day: "Tuesday", revenue: 19000, orders: 56 },
        { day: "Wednesday", revenue: 15000, orders: 50 },
        { day: "Thursday", revenue: 18000, orders: 55 },
        { day: "Friday", revenue: 22000, orders: 70 },
        { day: "Saturday", revenue: 30000, orders: 90 },
        { day: "Sunday", revenue: 25000, orders: 75 },
      ]

      responseData = {
        ...responseData,
        salesData,
        paymentMethodData,
        orderStatusData,
        salesByDayData,
      }
    }

    if (reportType === "products" || reportType === "all") {
      // Generate product data
      const topProductsData = [
        { name: "Smartphone X", quantity: 120, revenue: 120000 },
        { name: "Laptop Pro", quantity: 85, revenue: 170000 },
        { name: "Wireless Earbuds", quantity: 200, revenue: 60000 },
        { name: "Smart Watch", quantity: 150, revenue: 75000 },
        { name: "Gaming Console", quantity: 70, revenue: 210000 },
      ]
      const stockStatusData = [
        { name: "In Stock", value: 70 },
        { name: "Low Stock", value: 20 },
        { name: "Out of Stock", value: 10 },
      ]
      const lowStockData = [
        { id: "1", name: "Smartphone X", stock: 5, reorderLevel: 10 },
        { id: "2", name: "Laptop Pro", stock: 3, reorderLevel: 8 },
        { id: "3", name: "Wireless Earbuds", stock: 7, reorderLevel: 15 },
        { id: "4", name: "Smart Watch", stock: 4, reorderLevel: 10 },
        { id: "5", name: "Gaming Console", stock: 2, reorderLevel: 5 },
      ]

      responseData = {
        ...responseData,
        topProductsData,
        stockStatusData,
        lowStockData,
      }
    }

    if (reportType === "categories" || reportType === "all") {
      // Generate category data
      const categoryRevenueData = [
        { name: "Electronics", value: 45 },
        { name: "Clothing", value: 20 },
        { name: "Home & Kitchen", value: 15 },
        { name: "Books", value: 10 },
        { name: "Sports", value: 10 },
      ]
      const categoryGrowthData = [
        { name: "Electronics", growth: 15 },
        { name: "Clothing", growth: 8 },
        { name: "Home & Kitchen", growth: 12 },
        { name: "Books", growth: 5 },
        { name: "Sports", growth: 10 },
      ]
      const topCategories = ["Electronics", "Clothing", "Home & Kitchen"]
      const categoryTrendsData = generateCategoryTrendsData(startDate, endDate, topCategories)

      responseData = {
        ...responseData,
        categoryRevenueData,
        categoryGrowthData,
        topCategories,
        categoryTrendsData,
      }
    }

    if (reportType === "customers" || reportType === "all") {
      // Generate customer data
      const customerAcquisitionData = generateCustomerAcquisitionData(startDate, endDate)
      const customerRetentionData = generateCustomerRetentionData(startDate, endDate)
      const customerSegmentationData = [
        { name: "New", value: 30 },
        { name: "Returning", value: 45 },
        { name: "Loyal", value: 25 },
      ]
      const topCustomersData = [
        { id: "1", name: "John Doe", orders: 12, totalSpent: 45000 },
        { id: "2", name: "Jane Smith", orders: 10, totalSpent: 38000 },
        { id: "3", name: "Robert Johnson", orders: 8, totalSpent: 32000 },
        { id: "4", name: "Emily Davis", orders: 7, totalSpent: 28000 },
        { id: "5", name: "Michael Brown", orders: 6, totalSpent: 25000 },
      ]

      responseData = {
        ...responseData,
        customerAcquisitionData,
        customerRetentionData,
        customerSegmentationData,
        topCustomersData,
      }
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

// Helper functions to generate mock data
function generateSalesData(startDate: Date, endDate: Date) {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // Generate random data
    const revenue = Math.floor(Math.random() * 50000) + 10000
    const orders = Math.floor(Math.random() * 100) + 20

    data.push({
      date: currentDate.toISOString().split("T")[0],
      revenue,
      orders,
    })

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

function generateCategoryTrendsData(startDate: Date, endDate: Date, categories: string[]) {
  const data = []
  const currentDate = new Date(startDate)

  // Generate data for every 5 days to reduce data points
  while (currentDate <= endDate) {
    const entry: any = {
      date: currentDate.toISOString().split("T")[0],
    }

    // Add revenue for each category
    categories.forEach((category) => {
      entry[category] = Math.floor(Math.random() * 30000) + 5000
    })

    data.push(entry)

    // Move to next 5 days
    currentDate.setDate(currentDate.getDate() + 5)
  }

  return data
}

function generateCustomerAcquisitionData(startDate: Date, endDate: Date) {
  const data = []
  const currentDate = new Date(startDate)

  // Generate data for every 3 days to reduce data points
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split("T")[0],
      newCustomers: Math.floor(Math.random() * 50) + 10,
    })

    // Move to next 3 days
    currentDate.setDate(currentDate.getDate() + 3)
  }

  return data
}

function generateCustomerRetentionData(startDate: Date, endDate: Date) {
  const data = []
  const currentDate = new Date(startDate)

  // Generate data for every 7 days to reduce data points
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split("T")[0],
      retentionRate: Math.floor(Math.random() * 30) + 60, // 60-90%
    })

    // Move to next 7 days
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return data
}

