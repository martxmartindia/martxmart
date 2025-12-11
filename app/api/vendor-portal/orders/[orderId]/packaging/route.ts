import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const orderId = (await params).orderId
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id
    const data = await request.json()

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Verify that this order belongs to this vendor using ProductOrderItem
    const orderItem = await prisma.productOrderItem.findFirst({
      where: {
        orderId: orderId,
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        }
      },
      include: {
        order: true,
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      }
    })

    if (!orderItem) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 })
    }

    // Update order status to PROCESSING (since PACKAGING might not be a valid status in the enum)
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING"
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: "Order marked as processing",
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      }
    })

  } catch (error) {
    console.error("Error updating order processing status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}