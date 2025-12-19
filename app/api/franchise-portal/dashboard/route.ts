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
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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

    // Get customers count (unique customers who ordered from this franchise)
    const customerIds = [...new Set(franchise.orders.map(order => order.userId))];
    const totalCustomers = customerIds.length;

    // Recent orders (last 5) - formatted for frontend
    const recentOrders = franchise.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.user.name,
        },
        totalAmount: Number(order.totalAmount),
        status: order.status.toLowerCase(),
        createdAt: order.createdAt.toISOString(),
      }));

    // Calculate growth data (current month vs last month)
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentMonthStats, lastMonthStats] = await Promise.all([
      prisma.order.aggregate({
        where: {
          franchiseId: franchise.id,
          createdAt: { gte: currentMonth },
        },
        _count: true,
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: {
          franchiseId: franchise.id,
          createdAt: { gte: lastMonth, lt: currentMonth },
        },
        _count: true,
        _sum: { totalAmount: true },
      }),
    ]);

    const currentRevenue = Number(currentMonthStats._sum.totalAmount || 0);
    const lastRevenue = Number(lastMonthStats._sum.totalAmount || 0);
    const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

    const currentOrders = currentMonthStats._count;
    const lastOrders = lastMonthStats._count;
    const ordersGrowth = lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0;

    // Customer growth (unique customers)
    const [currentCustomers, lastCustomers] = await Promise.all([
      prisma.order.findMany({
        where: {
          franchiseId: franchise.id,
          createdAt: { gte: currentMonth },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),
      prisma.order.findMany({
        where: {
          franchiseId: franchise.id,
          createdAt: { gte: lastMonth, lt: currentMonth },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    const customersGrowth = lastCustomers.length > 0
      ? ((currentCustomers.length - lastCustomers.length) / lastCustomers.length) * 100
      : 0;

    // Product growth (simplified - could be based on inventory changes)
    const productsGrowth = 0; // Placeholder - would need historical inventory data

    // Sales by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrdersForChart = await prisma.order.findMany({
      where: {
        franchiseId: franchise.id,
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayAmount = recentOrdersForChart
        .filter(order => order.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, order) => sum + Number(order.totalAmount), 0);

      salesByDay.push({
        date: dateStr,
        amount: dayAmount,
      });
    }

    // Sales by category
    const categorySales = await prisma.order.findMany({
      where: { franchiseId: franchise.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
        shoppingItems: {
          include: {
            shopping: {
              include: { category: true },
            },
          },
        },
      },
    });

    const categoryMap = new Map();
    categorySales.forEach(order => {
      order.items.forEach(item => {
        const categoryName = item.product.category.name;
        const amount = Number(item.subtotal);
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
      });
      order.shoppingItems.forEach(item => {
        const categoryName = item.shopping.category.name;
        const amount = Number(item.subtotal);
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
      });
    });

    const salesByCategory = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories

    // Real notifications
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        franchiseId: franchise.id,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    });

    // Top products - fetch separately with proper relations
    const topProductsData = await prisma.productOrderItem.findMany({
      where: {
        order: {
          franchiseId: franchise.id,
        },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const productSales = new Map();
    topProductsData.forEach(item => {
      const productName = item.product.name;
      const category = item.product.category.name;
      const sold = item.quantity;
      if (productSales.has(productName)) {
        productSales.set(productName, {
          ...productSales.get(productName),
          sold: productSales.get(productName).sold + sold,
        });
      } else {
        productSales.set(productName, { name: productName, category, sold });
      }
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return NextResponse.json({
      metrics: {
        totalRevenue: totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        productsGrowth,
      },
      recentOrders,
      salesByCategory,
      salesByDay,
      topProducts,
      notifications,
    });
  } catch (error) {
    console.error("Franchise dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}