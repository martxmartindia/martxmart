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

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type") || "overview";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Get franchise
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Date range filter
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    } : {};

    if (reportType === "sales") {
      // Sales report
      const orders = await prisma.order.findMany({
        where: {
          franchiseId: franchise.id,
          ...dateFilter,
        },
        include: {
          items: true,
          shoppingItems: true,
        },
      });

      const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Sales by status
      const salesByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + Number(order.totalAmount);
        return acc;
      }, {} as Record<string, number>);

      // Daily sales
      const dailySales = orders.reduce((acc, order) => {
        const date = order.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + Number(order.totalAmount);
        return acc;
      }, {} as Record<string, number>);

      return NextResponse.json({
        reportType: "sales",
        period: { startDate, endDate },
        summary: {
          totalSales,
          totalOrders,
          averageOrderValue,
        },
        salesByStatus,
        dailySales: Object.entries(dailySales).map(([date, amount]) => ({ date, amount })),
      });
    }

    if (reportType === "inventory") {
      // Inventory report
      const [productInventory, shoppingInventory] = await Promise.all([
        prisma.productInventory.findMany({
          where: { franchiseId: franchise.id },
          include: { product: true },
        }),
        prisma.shoppingInventory.findMany({
          where: { franchiseId: franchise.id },
          include: { shopping: true },
        }),
      ]);

      const inventory = [
        ...productInventory.map(item => ({
          id: item.id,
          name: item.product.name,
          type: "product",
          quantity: item.quantity,
          minStock: item.minStock,
          status: item.quantity <= item.minStock ? "LOW_STOCK" : "IN_STOCK",
        })),
        ...shoppingInventory.map(item => ({
          id: item.id,
          name: item.shopping.name,
          type: "shopping",
          quantity: item.quantity,
          minStock: item.minStock,
          status: item.quantity <= item.minStock ? "LOW_STOCK" : "IN_STOCK",
        })),
      ];

      const totalItems = inventory.length;
      const lowStockItems = inventory.filter(item => item.status === "LOW_STOCK").length;
      const outOfStockItems = inventory.filter(item => item.quantity === 0).length;

      return NextResponse.json({
        reportType: "inventory",
        summary: {
          totalItems,
          lowStockItems,
          outOfStockItems,
          healthyItems: totalItems - lowStockItems - outOfStockItems,
        },
        inventory,
      });
    }

    if (reportType === "customers") {
      // Customer report
      const customers = await prisma.user.findMany({
        where: {
          orders: {
            some: {
              franchiseId: franchise.id,
              ...dateFilter,
            },
          },
        },
        include: {
          orders: {
            where: {
              franchiseId: franchise.id,
              ...dateFilter,
            },
            select: {
              totalAmount: true,
              createdAt: true,
            },
          },
        },
      });

      const customerStats = customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalOrders: customer.orders.length,
        totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
        lastOrderDate: customer.orders.length > 0
          ? customer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
          : null,
      }));

      const totalCustomers = customers.length;
      const totalRevenue = customerStats.reduce((sum, customer) => sum + customer.totalSpent, 0);
      const averageOrderValue = totalRevenue / customerStats.reduce((sum, customer) => sum + customer.totalOrders, 0);

      return NextResponse.json({
        reportType: "customers",
        period: { startDate, endDate },
        summary: {
          totalCustomers,
          totalRevenue,
          averageOrderValue,
        },
        customers: customerStats,
      });
    }

    // Default overview report
    const [orderStats, inventoryStats] = await Promise.all([
      prisma.order.aggregate({
        where: {
          franchiseId: franchise.id,
          ...dateFilter,
        },
        _count: true,
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.productInventory.aggregate({
        where: { franchiseId: franchise.id },
        _count: true,
        _sum: {
          quantity: true,
        },
      }),
    ]);

    return NextResponse.json({
      reportType: "overview",
      period: { startDate, endDate },
      summary: {
        totalOrders: orderStats._count,
        totalRevenue: orderStats._sum.totalAmount || 0,
        totalInventoryItems: inventoryStats._count,
        totalInventoryQuantity: inventoryStats._sum.quantity || 0,
      },
    });
  } catch (error) {
    console.error("Franchise reports error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}