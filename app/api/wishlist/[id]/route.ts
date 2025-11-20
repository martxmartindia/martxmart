import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function DELETE(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
  const { id} = await params 
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

    const wishlistItemId =id

    // Check if wishlist item exists and belongs to user
    const wishlistItem = await prisma.wishlist.findUnique({
      where: { id: wishlistItemId },
    })

    if (!wishlistItem) {
      return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 })
    }

    if (wishlistItem.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Remove from wishlist
    await prisma.wishlist.delete({
      where: { id: wishlistItemId },
    })

    return NextResponse.json({
      message: "Item removed from wishlist",
    })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

