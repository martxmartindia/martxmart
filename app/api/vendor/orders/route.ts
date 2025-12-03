import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, OrderStatus } from "@/types";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const timeRange = searchParams.get("timeRange") || "week";
    // Authenticate user
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'VENDOR') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!vendorProfile) {
      return NextResponse.json(
        { message: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const getDateRange = () => {
      const now = new Date();
      switch (timeRange) {
        case "week":
          return new Date(now.setDate(now.getDate() - 7));
        case "month":
          return new Date(now.setMonth(now.getMonth() - 1));
        case "year":
          return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
          return new Date(now.setDate(now.getDate() - 7));
      }
    };

    const startDate = getDateRange();

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: status !== "all" ? (status as OrderStatus) : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'VENDOR') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }   
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!vendorProfile) {
      return NextResponse.json(
        { message: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const { orderId } = await req.json();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
