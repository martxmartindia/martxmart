import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const coupon = await prisma.coupon.findFirst({
      where: { id, isDeleted: false },
      include: { admin: { select: { name: true, email: true } } }
    });

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { code, discount, isActive, expiresAt } = await req.json();

    const existingCoupon = await prisma.coupon.findFirst({
      where: { id, isDeleted: false }
    });

    if (!existingCoupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    if (code && code !== existingCoupon.code) {
      const duplicateCoupon = await prisma.coupon.findUnique({ where: { code } });
      if (duplicateCoupon) {
        return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discount !== undefined && { discount }),
        ...(isActive !== undefined && { isActive }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) })
      },
      include: { admin: { select: { name: true, email: true } } }
    });

    return NextResponse.json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingCoupon = await prisma.coupon.findFirst({
      where: { id, isDeleted: false }
    });

    if (!existingCoupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    await prisma.coupon.update({
      where: { id },
      data: { isDeleted: true }
    });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}