import { NextResponse,NextRequest } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
        // Check authentication
      const token = (await cookies()).get("token")?.value
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const decoded =await verifyJWT(token)
  
      if (!decoded || typeof decoded !== "object" || !decoded.payload.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const userId = decoded.payload.id as string;
    const order = await db.order.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        shoppingItems: {
          include: {
            shopping: {
              select: {
                id: true,
                name: true,
                images: true,
                brand: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        payment: {
          select: {
            method: true,
            status: true,
            razorpayPaymentId: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
