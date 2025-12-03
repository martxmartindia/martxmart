import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from '@/lib/auth-helpers';


export async function GET(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
  const { id} = await params 
  try {
    const productId = id

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
  const { id} = await params 
  try {
    // Check if user is authenticated
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId =id
    const { rating, comment } = await req.json()
    const userId = user.id
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
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
    const allReviews = await prisma.review.findMany({
      where: { productId },
    })

    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount: allReviews.length,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

