import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function PUT(req: Request) {
  try {
    const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const { itemId, quantity } = await req.json();
    if (!itemId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    await prisma.productCartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}