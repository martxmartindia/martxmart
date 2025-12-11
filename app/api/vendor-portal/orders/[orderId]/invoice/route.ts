import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest,
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
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
            payment: {
              select: {
                transactionId: true,
                method: true,
              },
            },
            shippingAddress: {
              select: {
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                zip: true,
              },
            },
          },
        },
        product: {
          select: {
            name: true,
            price: true,
            brand: true,
            modelNumber: true,
          },
        },
      }
    })

    if (!orderItem) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 })
    }

    // Generate invoice data
    const unitPrice = parseFloat(orderItem.price.toString())
    const totalAmount = unitPrice * orderItem.quantity

    const invoice = {
      invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
      orderId: orderItem.order.id,
      orderNumber: orderItem.order.orderNumber,
      customerName: orderItem.order.user.name,
      customerEmail: orderItem.order.user.email,
      customerPhone: orderItem.order.user.phone,
      customerAddress: [
        orderItem.order.shippingAddress?.addressLine1,
        orderItem.order.shippingAddress?.addressLine2,
        orderItem.order.shippingAddress?.city,
        orderItem.order.shippingAddress?.state,
        orderItem.order.shippingAddress?.zip
      ].filter(Boolean).join(', '),
      productName: orderItem.product.name,
      productBrand: orderItem.product.brand,
      productModel: orderItem.product.modelNumber,
      quantity: orderItem.quantity,
      unitPrice: unitPrice,
      totalAmount: totalAmount,
      orderDate: orderItem.order.createdAt,
      paymentMethod: orderItem.order.payment?.method || "Unknown",
      transactionId: orderItem.order.payment?.transactionId || "N/A",
      vendorName: session.user.name,
      vendorEmail: session.user.email,
    }

    return NextResponse.json({
      message: "Invoice generated successfully",
      invoice
    })

  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}