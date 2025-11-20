import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma as db } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"
export async function GET(request: Request) {
  try {
      // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJWT(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id as string;

    const wishlistItems = await db.wishlist.findMany({
      where: { userId: userId},
      include: {
        shopping: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            originalPrice: true,
            images: true,
            stock: true,
            brand: true,
            averageRating: true,
            reviewCount: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error("Wishlist fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id as string
    const { shoppingId } = await request.json()

    // Check if already in wishlist
    const existingItem = await db.wishlist.findFirst({
      where: {
        userId,
        shoppingId,
      },
    })

    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
    }

    await db.wishlist.create({
      data: {
        userId,
        shoppingId,
      },
    })

    return NextResponse.json({ message: "Item added to wishlist" })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id as string
    const { searchParams } = new URL(request.url)
    const shoppingId = searchParams.get("shoppingId")

    if (!shoppingId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    await db.wishlist.deleteMany({
      where: {
        userId,
        shoppingId,
      },
    })

    return NextResponse.json({ message: "Item removed from wishlist" })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
