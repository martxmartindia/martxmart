import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function DELETE(req: Request) {
  try {
    const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const { itemId } = await req.json();
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    await prisma.productCartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}