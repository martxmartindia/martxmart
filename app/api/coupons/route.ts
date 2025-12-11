import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get("code");

    // If specific coupon code is requested, validate it
    if (code) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          isActive: true,
          isDeleted: false,
          expiresAt: {
            gt: new Date() // Not expired
          }
        },
        select: {
          id: true,
          code: true,
          discount: true,
          expiresAt: true
        }
      });

      if (!coupon) {
        return NextResponse.json({ 
          valid: false, 
          message: "Invalid or expired coupon code" 
        }, { status: 404 });
      }

      return NextResponse.json({ 
        valid: true, 
        coupon 
      });
    }

    // Otherwise, return all valid coupons for public display
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        expiresAt: {
          gt: new Date() // Not expired
        }
      },
      select: {
        id: true,
        code: true,
        discount: true,
        expiresAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 10 // Limit for public display
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ 
        valid: false, 
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
        valid: false, 
        message: "Invalid or expired coupon code" 
      }, { status: 404 });
    }

    // Calculate discount amount
    const discountAmount = (cartTotal * coupon.discount) / 100;
    const finalAmount = cartTotal - discountAmount;

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountAmount: discountAmount,
        finalAmount: finalAmount
      },
      message: "Coupon applied successfully"
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
