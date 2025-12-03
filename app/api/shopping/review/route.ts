import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-helpers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shoppingId = searchParams.get("shoppingId")
    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "10")

    if (!shoppingId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const skip = (page - 1) * limit

    const reviews = await db.review.findMany({
      where: { shoppingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    const totalReviews = await db.review.count({
      where: { shoppingId },
    })

    // Calculate rating distribution
    const ratingDistribution = await db.review.groupBy({
      by: ["rating"],
      where: { shoppingId },
      _count: { rating: true },
    })

    const distribution = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1
      const count = ratingDistribution.find((r) => r.rating === rating)?._count.rating || 0
      return { rating, count }
    }).reverse()

    // Calculate average rating
    const avgRating = await db.review.aggregate({
      where: { shoppingId },
      _avg: { rating: true },
    })

    return NextResponse.json({
      reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        totalPages: Math.ceil(totalReviews / limit),
      },
      stats: {
        averageRating: Number(avgRating._avg.rating) || 0,
        totalReviews,
        distribution,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
       // Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.id;

    const { shoppingId, rating, comment, orderId } = await request.json()

    if (!shoppingId || !rating) {
      return NextResponse.json({ error: "Product ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if user has purchased this product
    const hasPurchased = await db.shoppingOrderItem.findFirst({
      where: {
        shoppingId,
        order: {
          userId: userId,
          status: "DELIVERED",
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json({ error: "You can only review products you have purchased" }, { status: 400 })
    }

    // Check if user has already reviewed this product
    const existingReview = await db.review.findFirst({
      where: {
        userId: userId,
        shoppingId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    const review = await db.review.create({
      data: {
        userId: userId,
        shoppingId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Update product average rating
    const avgRating = await db.review.aggregate({
      where: { shoppingId },
      _avg: { rating: true },
      _count: { rating: true },
    })

    await db.shopping.update({
      where: { id: shoppingId },
      data: {
        averageRating: Number(avgRating._avg.rating) || 0,
        reviewCount: avgRating._count.rating || 0,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
