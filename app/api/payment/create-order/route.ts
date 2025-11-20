import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const { reportId, amount } = await request.json()

    // Verify the report exists
    const report = await prisma.projectReport.findUnique({
      where: { id: reportId },
      include: { Project: true }
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: reportId.substring(0, 40), // Ensure receipt is ≤40 chars
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}