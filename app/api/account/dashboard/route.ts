import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"

export async function GET() {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id

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

