import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";


export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, cartTotal } = await request.json();
    
    if (!code || !cartTotal) {
      return NextResponse.json({ error: "Coupon code and cart total are required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        isDeleted: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 400 });
    }

    const discountAmount = (cartTotal * coupon.discount) / 100;
    const finalTotal = Math.max(0, cartTotal - discountAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount
      },
      discountAmount,
      finalTotal
    });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}