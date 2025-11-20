import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET() {
  try {
    // Check if user is authenticated
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    // @ts-expect-error - JWT payload type is dynamic
    const userId = decoded.id

    // Get wishlist items
    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      items: wishlistItems.map((cartItems) => ({
        id: cartItems.id,
        productId: cartItems.productId,
        name: cartItems.product?.name,
        price: cartItems.product?.price,
        image: cartItems.product?.images[0] || null,
        createdAt: cartItems.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-expect-error - JWT payload type is dynamic
    const userId = decoded.id

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    })

    if (existingItem) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    })

    return NextResponse.json({
      message: "Product added to wishlist",
      wishlistItem,
    })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

