import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

// Get cart items
export async function GET() {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], totalAmount: 0 });
    }

    const cartItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: Number(item.price),
      quantity: item.quantity,
      image: item.product.images[0] || null,
    }));

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      items: cartItems,
      cartId: cart.id,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Add item to cart
export async function POST(req: Request) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;

    const body = await req.json();    
    // Extract productId - handle both direct ID and nested object
    let productId;
    if (typeof body === 'string') {
      productId = body;
    } else if (body.productId) {
      productId = typeof body.productId === 'object' ? body.productId.id : body.productId;
    } else if (body.id) {
      productId = typeof body.id === 'object' ? body.id.id : body.id;
    }
    
    const quantity = body.quantity || 1;
      
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock available" }, { status: 400 });
    }

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId:userId as string },
        include: { items: true },
      });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      await prisma.productCartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.productCartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
      });
    }

    const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });

    const totalAmount = updatedCart!.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    return NextResponse.json({
      message: "Item added to cart",
      cartId: cart.id,
      totalAmount,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

// Clear cart
export async function DELETE() {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart is already empty" });
    }

    await prisma.productCartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}