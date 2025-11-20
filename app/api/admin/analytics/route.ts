import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";

export async function GET(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      ordersByStatus,
      topProducts,
      userRegistrations,
      paymentMethods
    ] = await Promise.all([
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
        _sum: { totalAmount: true },
      }),
      prisma.product.findMany({
        include: {
          category: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
        where: { isDeleted: false },
      }),
      prisma.payment.groupBy({
        by: ['method'],
        _count: { method: true },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      ordersByStatus,
      topProducts,
      userRegistrations,
      paymentMethods,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}