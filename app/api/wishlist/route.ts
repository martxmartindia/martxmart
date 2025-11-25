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
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id

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

