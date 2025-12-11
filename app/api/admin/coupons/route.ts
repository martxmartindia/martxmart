import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = new URL(req.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    // Build where clause for filtering
    const whereClause: any = {
      isDeleted: false,
      code: { contains: search, mode: 'insensitive' }
    };

    // Only add isActive filter if it's not empty string
    if (isActive !== null && isActive !== "") {
      whereClause.isActive = isActive === "true";
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.coupon.count({
        where: whereClause
      })
    ]);

    return NextResponse.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      total,
      page,
      limit
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { code, discount, expiresAt } = await req.json();

    if (!code || !discount || !expiresAt) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }

    // Find first admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!adminUser) {
      return NextResponse.json({ message: "No admin user found" }, { status: 500 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount,
        expiresAt: new Date(expiresAt),
        adminId: adminUser.id
      },
      include: { admin: { select: { name: true, email: true } } }
    });

    return NextResponse.json({ message: "Coupon created successfully", coupon }, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}