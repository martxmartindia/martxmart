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
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const level = searchParams.get("level") || undefined
    const source = searchParams.get("source") || undefined
    const search = searchParams.get("search") || undefined
    const from = searchParams.get("from") || undefined
    const to = searchParams.get("to") || undefined

    // In a real implementation, this would query a logs table in the database
    // For this example, we'll generate mock log data

    // Generate mock logs
    const allLogs = generateMockLogs(100)

    // Apply filters
    let filteredLogs = allLogs

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level.toLowerCase() === level.toLowerCase())
    }

    if (source) {
      filteredLogs = filteredLogs.filter((log) => log.source.toLowerCase() === source.toLowerCase())
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.message.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          (log.userName && log.userName.toLowerCase().includes(searchLower)),
      )
    }

    if (from) {
      const fromDate = new Date(from)
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= fromDate)
    }

    if (to) {
      const toDate = new Date(to)
      toDate.setHours(23, 59, 59, 999) // End of day
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= toDate)
    }

    // Sort logs by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply pagination
    const skip = (page - 1) * limit
    const paginatedLogs = filteredLogs.slice(skip, skip + limit)

    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        total: filteredLogs.length,
        page,
        limit,
        totalPages: Math.ceil(filteredLogs.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

function generateMockLogs(count: number) {
  const logs = []
  const sources = ["auth", "orders", "products", "users", "system", "api", "payment", "shipping"]
  const levels = ["info", "warning", "error", "debug", "success"]
  const messages = [
    "User login successful",
    "Failed login attempt",
    "Order processed successfully",
    "Payment verification failed",
    "New product added",
    "Database backup completed",
    "API rate limit exceeded",
    "System update scheduled",
    "Low disk space warning",
    "New user registered",
    "Password reset requested",
    "Email verification sent",
    "Product inventory updated",
    "Order status changed",
    "User profile updated",
    "Admin login detected",
    "Security alert: multiple failed login attempts",
    "Database query performance issue detected",
    "Scheduled maintenance completed",
    "File upload failed",
    "Payment gateway error",
    "Shipping label generated",
    "Order refund processed",
    "User account locked",
    "API endpoint deprecated warning",
  ]

  const userNames = [
    "John Doe",
    "Jane Smith",
    "Robert Johnson",
    "Emily Davis",
    "Michael Brown",
    "Sarah Wilson",
    "David Thompson",
    "Lisa Anderson",
    "System",
    "Automated Process",
  ]

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < count; i++) {
    const randomTimestamp = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
    )

    const source = sources[Math.floor(Math.random() * sources.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]
    const userName = userNames[Math.floor(Math.random() * userNames.length)]

    // Only include user info for certain types of logs
    const includeUserInfo = Math.random() > 0.3 && userName !== "System" && userName !== "Automated Process"

    logs.push({
      id: `log-${i}`,
      timestamp: randomTimestamp.toISOString(),
      level,
      source,
      message,
      details: `Additional details for ${message.toLowerCase()}. This provides more context about the event that occurred.`,
      userId: includeUserInfo ? `user-${Math.floor(Math.random() * 1000)}` : undefined,
      userName: includeUserInfo ? userName : undefined,
      ip: includeUserInfo ? `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : undefined,
      userAgent: includeUserInfo
        ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        : undefined,
    })
  }

  return logs
}

