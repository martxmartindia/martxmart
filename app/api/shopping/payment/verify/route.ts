import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import crypto from "crypto"
import { getAuthenticatedUser } from '@/lib/auth-helpers';



export async function POST(request: Request) {
  try {
        // Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update payment and order status
    await db.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    })

    await db.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    })

    return NextResponse.json({ message: "Payment verified successfully" })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
