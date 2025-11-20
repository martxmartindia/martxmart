import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/auth";

export async function DELETE(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== "object" || !decoded.payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decoded.payload.id;

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