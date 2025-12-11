import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
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
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""
    const search = searchParams.get("search") || ""

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ message: "Invalid pagination parameters" }, { status: 400 })
    }

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Build where clause for filtering orders that contain this vendor's products
    const where: any = {
      items: {
        some: {
          product: {
            VendorProfile: {
              some: {
                id: vendorProfile.id
              }
            }
          }
        }
      }
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Get orders with vendor's products
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                VendorProfile: {
                  select: {
                    id: true
                  },
                  where: {
                    id: vendorProfile.id
                  }
                }
              }
            }
          },
          where: {
            product: {
              VendorProfile: {
                some: {
                  id: vendorProfile.id
                }
              }
            }
          }
        },
        shippingAddress: {
          select: {
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            zip: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format orders for frontend
    const formattedOrders = orders.map(order => {
      // Filter items to only include those from this vendor
      const vendorItems = order.items.filter(item =>
        item.product.VendorProfile.length > 0
      )

      const totalVendorAmount = vendorItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price.toString()) * item.quantity)
      }, 0)

      const totalPlatformAmount = vendorItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price.toString()) * item.quantity)
      }, 0)

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        platformOrderId: order.id,
        customerName: order.user.name,
        items: vendorItems.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          vendorPrice: parseFloat(item.price.toString()),
          platformPrice: parseFloat(item.price.toString())
        })),
        totalVendorAmount,
        totalPlatformAmount,
        status: order.status,
        packagingStatus: order.status === 'PROCESSING' ? 'PENDING' : 'COMPLETED',
        shippingAddress: [
          order.shippingAddress?.addressLine1,
          order.shippingAddress?.addressLine2,
          order.shippingAddress?.city,
          order.shippingAddress?.state,
          order.shippingAddress?.zip
        ].filter(Boolean).join(', '),
        specialInstructions: order.notes || "",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        vendorInvoiceNumber: `VINV-${order.id.slice(-8).toUpperCase()}`
      }
    })

    // Apply search filter
    let filteredOrders = formattedOrders
    if (search) {
      filteredOrders = formattedOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.platformOrderId.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: {
        ...where,
        ...(search && {
          OR: [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { user: { name: { contains: search, mode: 'insensitive' } } }
          ]
        })
      }
    })

    return NextResponse.json({
      orders: filteredOrders,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    })

  } catch (error) {
    console.error("Error fetching vendor orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}