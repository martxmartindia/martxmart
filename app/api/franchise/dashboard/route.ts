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

    // Get franchise info
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
      include: {
        staff: true,
        orders: {
          include: {
            items: true,
            shoppingItems: true,
          },
        },
        productInventory: true,
        shoppingInventory: true,
      },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Calculate dashboard metrics
    const totalOrders = franchise.orders.length;
    const totalRevenue = franchise.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const pendingOrders = franchise.orders.filter(order => order.status === "PENDING").length;
    const completedOrders = franchise.orders.filter(order => order.status === "DELIVERED" || order.status === "COMPLETED").length;

    const totalProducts = franchise.productInventory.length + franchise.shoppingInventory.length;
    const lowStockProducts = [
      ...franchise.productInventory.filter(item => item.quantity <= item.minStock),
      ...franchise.shoppingInventory.filter(item => item.quantity <= item.minStock),
    ].length;

    const totalStaff = franchise.staff.length;

    // Recent orders (last 5)
    const recentOrders = franchise.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      }));

    return NextResponse.json({
      franchise: {
        id: franchise.id,
        name: franchise.name,
        status: franchise.status,
        commissionRate: franchise.commissionRate,
      },
      metrics: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        totalProducts,
        lowStockProducts,
        totalStaff,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Franchise dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}