import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const users = await getAuthenticatedUser();
    if (!users) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: users.id },
    });

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { orderId } = body;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Validate the order
    const order = await prisma.order.findUnique({
      where: { 
        id: orderId,
        userId: users.id,
        status: "PENDING",
      },
      include: { 
        items: { 
          include: { product: true } 
        } 
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found, unauthorized, or not in pending status" },
        { status: 404 }
      );
    }

    if (!user?.phone) {
      console.warn("User phone not found, using default");
    }

    // Update order status to PROCESSING
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.totalAmount) * 100),
      currency: "INR", // Fixed to INR
      receipt: orderId,
      notes: {
        orderId,
        orderItems: JSON.stringify(
          order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        ),
      },
    });

    // Update existing payment
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        method: "RAZORPAY",
        status: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        currency: "INR",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      razorpayOrderId: razorpayOrder.id,
      amount: Number(order.totalAmount),
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      customerName: user?.name,
      customerEmail: user?.email,
      customerPhone: user?.phone,
    });
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}