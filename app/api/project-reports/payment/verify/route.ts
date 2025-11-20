import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { reportId, paymentId, orderId, signature } = await request.json()

    if (!reportId || !paymentId || !orderId || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify Razorpay signature
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update project report payment status
    await prisma.projectReport.update({
      where: { id: reportId },
      data: {
        paymentStatus: "Completed",
        paymentId: paymentId,
        status: "Processing"
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}