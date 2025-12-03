import { NextResponse,NextRequest } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { getAuthenticatedUser } from '@/lib/auth-helpers';


export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
        // Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;
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
