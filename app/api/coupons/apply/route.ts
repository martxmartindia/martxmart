import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, cartTotal, userId } = await req.json();

    if (!code) {
      return NextResponse.json({ 
        success: false,
        message: "Coupon code is required" 
      }, { status: 400 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        isDeleted: false,
        expiresAt: {
          gt: new Date() // Not expired
        }
      }
    });

    if (!coupon) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid or expired coupon code" 
      }, { status: 404 });
    }

    // Calculate discount amount
    const discountAmount = cartTotal ? (cartTotal * coupon.discount) / 100 : 0;
    const finalAmount = cartTotal ? cartTotal - discountAmount : 0;

    // Here you could add logic to track coupon usage by user
    // For now, just return the calculation results
    
    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        originalAmount: cartTotal
      },
      message: "Coupon applied successfully"
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    return NextResponse.json({ 
      success: false,
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}