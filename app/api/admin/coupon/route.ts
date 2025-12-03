import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const coupons = await prisma.coupon.findMany();
    return NextResponse.json({ message: "Coupons found", coupons }, { status: 200 });
} catch (error) {
  console.error(error);
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}

export async function POST(req: NextRequest) {
try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const { code, discount } = await req.json();
    if (!code || !discount) {
      return NextResponse.json({ message: "Code and discount are required" }, { status: 400 });
    }
  
    // Check if coupon already exists
    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon already exists" }, { status: 400 });
    }
  
    // Create coupon with expiration in 7 days
    const coupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        admin:{
          connect:{
            id:session.user.id
          }
        }
      },
    });
  
    return NextResponse.json({ message: "Coupon created", coupon }, { status: 201 });
} catch (error) {
  console.error(error);
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ message: "Code is required" }, { status: 400 });
    }
  
    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (!existingCoupon) {
      return NextResponse.json({ message: "Coupon does not exist" }, { status: 400 });
    }
    // Delete coupon
    await prisma.coupon.delete({ where: { code } });
  
    return NextResponse.json({ message: "Coupon deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { code, isActive } = await req.json();
    if (!code || isActive === undefined) {
      return NextResponse.json({ message: "Code and isActive are required" }, { status: 400 });
    }
    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (!existingCoupon) {
      return NextResponse.json({ message: "Coupon does not exist" }, { status: 400 });
    }

    // Update coupon
    const coupon = await prisma.coupon.update({
      where: { code },
      data: { isActive },
    })
    return NextResponse.json({ message: "Coupon updated", coupon }, { status: 200 });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}