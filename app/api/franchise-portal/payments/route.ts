import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    const payments = await prisma.franchisePayment.findMany({
      where: { franchiseId: franchise.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate summary
    const totalReceived = payments
      .filter(p => p.status === "SUCCESS")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayments = payments.filter(p => p.status === "PENDING").length;
    const thisMonthPayments = payments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() &&
             paymentDate.getFullYear() === now.getFullYear();
    }).length;

    return NextResponse.json({
      payments,
      summary: {
        totalReceived,
        pendingPayments,
        thisMonthPayments,
        totalPayments: payments.length,
      },
    });
  } catch (error) {
    console.error("Franchise payments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}