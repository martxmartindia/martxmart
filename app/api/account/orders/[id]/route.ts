import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"
import { z } from "zod";

// Define schema for UUID validation
const uuidSchema = z.string().uuid("Invalid order ID format");

// Define response type
interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  paymentStatus?: string;
  transactionId?: string;
  currency: string;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Resolve params and validate ID
    const { id } = await params;
    const parsedId = uuidSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json({ error: parsedId.error.message }, { status: 400 });
    }

    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;

    // Fetch order with necessary fields
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        shoppingItems: {
          include: {
            shopping: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: {
          select: {
            contactName: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            zip: true,
            placeOfSupply: true,
            phone: true,
          },
        },
        payment: {
          select: {
            method: true,
            currency: true,
            status: true,
            razorpayPaymentId: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order belongs to user
    if (order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized: Order does not belong to user" }, { status: 403 });
    }

    // Calculate subtotal from all items
    const productSubtotal = order.items.reduce((acc, item) => acc + (item.quantity * Number(item.price)), 0);
    const shoppingSubtotal = order.shoppingItems.reduce((acc, item) => acc + (item.quantity * Number(item.price)), 0);
    const subtotal = productSubtotal + shoppingSubtotal;
    const tax = subtotal * 0.18; // 18% tax
    const shippingCost = 50; // Default shipping cost

    // Transform order to match frontend interface
    const transformedOrder: OrderResponse = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingCost: shippingCost,
      tax: tax,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paymentMethod: order.payment?.method ?? "Cash on Delivery",
      paymentStatus: order.payment?.status ?? "PENDING",
      transactionId: order.payment?.razorpayPaymentId ?? undefined,
      currency: order.payment?.currency ?? "INR",
      shippingAddress: order.shippingAddress
        ? {
          fullName: order.shippingAddress.contactName,
          addressLine1: order.shippingAddress.addressLine1,
          addressLine2: order.shippingAddress.addressLine2,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.zip,
          country: order.shippingAddress.placeOfSupply ?? "India",
          phoneNumber: order.shippingAddress.phone ?? "",
        }
        : null,
      items: [
        ...order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
          product: {
            id: item.product.id,
            name: item.product.name,
            images: item.product.images,
          },
        })),
        ...order.shoppingItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
          product: {
            id: item.shopping.id,
            name: item.shopping.name,
            images: item.shopping.images,
          },
        })),
      ],
      trackingNumber: null,
      estimatedDelivery: null
    };

    return NextResponse.json({ order: transformedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}