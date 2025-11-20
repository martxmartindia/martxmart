import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET() {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id

    // Get order count
    const orderCount = await prisma.order.count({
      where: {
        id:userId as string,
      },
    })

    // Get wishlist count
    const wishlistCount = await prisma.wishlist.count({
      where: {
        id :userId as string,
      },
    })

    // Get quotation count
    const quotationCount = await prisma.quotation.count({
      where: {
        id :userId as string,
      },
    })

    // Get review count
    const reviewCount = await prisma.review.count({
      where: {
        id :userId as string,
      },
    })

    return NextResponse.json({
      orders: orderCount,
      wishlistItems: wishlistCount,
      quotations: quotationCount,
      reviews: reviewCount,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

