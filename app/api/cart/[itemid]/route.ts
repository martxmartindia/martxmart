import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/auth";

// Update cart item quantity
export async function PUT(req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const itemId = (await params).itemId;

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== "object" || !decoded.payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decoded.payload.id;

    const { quantity } = await req.json();
    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    const cartItem = await prisma.shoppingCartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        shopping: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (cartItem.shopping.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock available" }, { status: 400 });
    }

    await prisma.shoppingCartItem.update({
      where: { id:itemId },
      data: { quantity },
    });

    const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        shoppingItems: {
          include: { shopping: true },
        },
      },
    });

    const totalAmount = updatedCart!.shoppingItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    return NextResponse.json({
      message: "Cart item updated",
      quantity,
      totalAmount,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const itemId = (await params).itemId;
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== "object" || !decoded.payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decoded.payload.id;

    const cartItem = await prisma.shoppingCartItem.findUnique({
      where: { id:itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.shoppingCartItem.delete({
      where: { id:itemId },
    });

    const updatedCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        shoppingItems: {
          include: { shopping: true },
        },
      },
    });

    const totalAmount = updatedCart?.shoppingItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    ) || 0;

    return NextResponse.json({
      message: "Item removed from cart",
      totalAmount,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}