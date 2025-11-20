import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId },
      include: { order: true },
    });

    if (!payment?.razorpayOrderId) {
      return NextResponse.json({ error: "Payment not found" }, { status: 400 });
    }

    // Verify signature
    const body = payment.razorpayOrderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update payment and order
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}