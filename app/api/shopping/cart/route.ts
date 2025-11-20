import { NextResponse } from "next/server"
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
    const cart = await db.cart.findFirst({
      where: { userId:userId },
      include: {
        shoppingItems: {
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
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({
        cart: { id: null, shoppingItems: [] },
        summary: { itemCount: 0, subtotal: 0, originalTotal: 0, savings: 0 },
      })
    }

    // Calculate summary
    const itemCount = cart.shoppingItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cart.shoppingItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    const originalTotal = cart.shoppingItems.reduce(
      (sum, item) => sum + (Number(item.shopping.originalPrice) || Number(item.price)) * item.quantity,
      0,
    )
    const savings = originalTotal - subtotal

    return NextResponse.json({
      cart,
      summary: {
        itemCount,
        subtotal,
        originalTotal,
        savings,
      },
    })
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    const { shoppingId, quantity } = await request.json()

    // Get or create cart
    let cart = await db.cart.findFirst({
      where: { userId:userId },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: userId },
      })
    }

    // Get product details
    const product = await db.shopping.findUnique({
      where: { id: shoppingId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Check if item already exists in cart
    const existingItem = await db.shoppingCartItem.findFirst({
      where: {
        cartId: cart.id,
        shoppingId,
      },
    })

    if (existingItem) {
      // Update quantity
      await db.shoppingCartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })
    } else {
      // Add new item
      await db.shoppingCartItem.create({
        data: {
          cartId: cart.id,
          shoppingId,
          quantity,
          price: product.price,
        },
      })
    }

    return NextResponse.json({ message: "Item added to cart" })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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
    const { itemId, quantity } = await request.json()

    if (quantity === 0) {
      // Remove item
      await db.shoppingCartItem.delete({
        where: { id: itemId },
      })
    } else {
      // Update quantity
      await db.shoppingCartItem.update({
        where: { id: itemId },
        data: { quantity },
      })
    }

    return NextResponse.json({ message: "Cart updated" })
  } catch (error) {
    console.error("Cart update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
