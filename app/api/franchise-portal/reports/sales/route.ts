import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Order } from "@prisma/client";

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

    // Get all orders for this franchise
    const orders = await prisma.order.findMany({
      where: { franchiseId: franchise.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        shoppingItems: {
          include: {
            shopping: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group orders by date
    const salesByDate = new Map();

    orders.forEach((order: Order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!salesByDate.has(date)) {
        salesByDate.set(date, {
          date,
          orders: [],
          totalSales: 0,
          orderCount: 0,
        });
      }

      const dayData = salesByDate.get(date);
      dayData.orders.push(order);
      dayData.totalSales += Number(order.totalAmount);
      dayData.orderCount += 1;
    });

    // Convert to array
    const dailySales = Array.from(salesByDate.values()).map(day => ({
      date: day.date,
      totalSales: day.totalSales,
      orderCount: day.orderCount,
      averageOrderValue: day.orderCount > 0 ? day.totalSales / day.orderCount : 0,
    }));

    // Calculate summary statistics
    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Sales by status
    const salesByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + Number(order.totalAmount);
      return acc;
    }, {} as Record<string, number>);

    // Recent orders (last 10)
    const recentOrders = orders.slice(0, 10).map(order => ({
      id: order.id,
      customerName: order.user.name,
      customerEmail: order.user.email,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.length + order.shoppingItems.length,
    }));

    return NextResponse.json({
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue,
      },
      salesByStatus,
      dailySales,
      recentOrders,
    });
  } catch (error) {
    console.error("Franchise sales report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}