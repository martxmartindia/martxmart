import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";
import { Role, OrderStatus } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const timeRange = searchParams.get("timeRange") || "week";

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user || user.payload.role !== Role.VENDOR) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vendorId = user.payload.id;
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId as string },
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
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user || user.payload.role !== Role.VENDOR) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vendorId = user.payload.id;
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId as string },
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
