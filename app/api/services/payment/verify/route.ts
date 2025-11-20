import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  const { applicationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

  try {
    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Find the ServiceApplication to get the serviceOrderId
    const application = await prisma.serviceApplication.findUnique({
      where: { id: applicationId },
      select: { serviceOrderId: true },
    });

    if (!application || !application.serviceOrderId) {
      return NextResponse.json({ error: "Application or order not found" }, { status: 404 });
    }

    // Find the ServiceOrder using serviceOrderId
    const order = await prisma.serviceOrder.findFirst({
      where: {
        id: application.serviceOrderId,
        razorpayOrderId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        serviceId: order.id, // Corrected from serviceId
        amount: order.amount,
        status: "SUCCESS", // Corrected from SUCCESS to match schema
        razorpayPaymentId,
        method: "RAZORPAY",
      },
    });

    // Update ServiceOrder
    await prisma.serviceOrder.update({
      where: { id: order.id },
      data: {
        paymentId: payment.id,
        status: "PAID",
      },
    });

    // Update ServiceApplication status
    await prisma.serviceApplication.update({
      where: { id: applicationId },
      data: { status: "COMPLETED" }, // Changed to PAID to align with ServiceOrder
    });

    return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}