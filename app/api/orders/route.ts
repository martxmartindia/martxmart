import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;
    const { items, address, paymentMethod, totalAmount, appliedCoupon } = await request.json();

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        totalAmount,
        status: "PENDING",
        notes: JSON.stringify({ address, paymentMethod, appliedCoupon }),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create payment record
    let razorpayOrderId = null;
    if (paymentMethod === "razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: order.id.slice(-20),
      });

      razorpayOrderId = razorpayOrder.id;
      
      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: "RAZORPAY",
          status: "PENDING",
          razorpayOrderId,
        },
      });
    } else {
      // Create COD payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: "COD",
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId,
      totalAmount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;
    
    console.log("✅ [Orders API] Successfully authenticated via NextAuth:", { 
      userId, 
      role: user.role 
    });
    
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedOrders = orders.map(order => {
      const orderData = order.notes ? JSON.parse(order.notes) : {};
      return {
        ...order,
        paymentMethod: orderData.paymentMethod || 'N/A',
        paymentStatus: order.payment?.status || 'PENDING',
        shippingAddress: orderData.address ? JSON.stringify(orderData.address) : null,
        appliedCoupon: orderData.appliedCoupon || null,
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}