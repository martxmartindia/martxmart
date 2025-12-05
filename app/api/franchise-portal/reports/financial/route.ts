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

    // Get orders for the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const orders = await prisma.order.findMany({
      where: {
        franchiseId: franchise.id,
        createdAt: {
          gte: threeMonthsAgo,
        },
      },
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group orders by month
    const monthlyData = new Map();

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          revenue: 0,
          expenses: 0, // Mock expenses (in real app, you'd have expense tracking)
          profit: 0,
          orders: 0,
        });
      }

      const monthData = monthlyData.get(monthKey);
      monthData.revenue += Number(order.totalAmount);
      monthData.orders += 1;
    });

    // Calculate profits and mock expenses
    console.log('Sorting financial data, sample a.month:', Array.from(monthlyData.values())[0]?.month);
    const financialData = Array.from(monthlyData.values())
      .sort((a, b) => {
        const dateA = new Date(a.month + ' 1');
        const dateB = new Date(b.month + ' 1');
        console.log('dateA:', dateA, 'dateB:', dateB);
        return dateA.getTime() - dateB.getTime();
      })
      .map(month => {
        // Mock expenses as 30% of revenue
        month.expenses = month.revenue * 0.3;
        month.profit = month.revenue - month.expenses;
        return month;
      });

    // Calculate overall statistics
    const totalRevenue = financialData.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = financialData.reduce((sum, month) => sum + month.expenses, 0);
    const totalProfit = financialData.reduce((sum, month) => sum + month.profit, 0);
    const totalOrders = financialData.reduce((sum, month) => sum + month.orders, 0);

    // Calculate growth rates
    if (financialData.length >= 2) {
      const currentMonth = financialData[financialData.length - 1];
      const previousMonth = financialData[financialData.length - 2];

      const revenueGrowth = previousMonth.revenue > 0
        ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
        : 0;

      const profitGrowth = previousMonth.profit > 0
        ? ((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100
        : 0;

      const orderGrowth = previousMonth.orders > 0
        ? ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100
        : 0;

      // Add growth data to the most recent month
      financialData[financialData.length - 1].growth = revenueGrowth;
    }

    // Calculate average growth across all months
    const averageGrowth = financialData.length > 1
      ? financialData.reduce((sum, month, index) => {
          if (index === 0) return sum;
          const prevMonth = financialData[index - 1];
          const growth = prevMonth.revenue > 0
            ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100
            : 0;
          return sum + growth;
        }, 0) / (financialData.length - 1)
      : 0;

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        totalOrders,
        averageGrowth,
        profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      },
      monthlyData: financialData,
    });
  } catch (error) {
    console.error("Franchise financial report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}