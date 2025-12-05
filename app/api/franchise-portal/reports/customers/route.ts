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
    });

    // Group orders by customer
    const customerMap = new Map();

    orders.forEach(order => {
      const customerId = order.userId;
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: order.user.name,
          email: order.user.email,
          orders: [],
          totalSpent: 0,
          lastOrderDate: null,
        });
      }

      const customer = customerMap.get(customerId);
      customer.orders.push(order);
      customer.totalSpent += Number(order.totalAmount);

      const orderDate = new Date(order.createdAt);
      if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
        customer.lastOrderDate = orderDate;
      }
    });

    // Convert to array and calculate additional metrics
    const customerData = Array.from(customerMap.values()).map(customer => ({
      id: `CUST-${customer.id.slice(-6)}`,
      name: customer.name,
      email: customer.email,
      totalOrders: customer.orders.length,
      totalSpent: customer.totalSpent,
      lastOrder: customer.lastOrderDate ? customer.lastOrderDate.toISOString().split('T')[0] : null,
      status: customer.orders.some((order: Order) =>
        new Date(order.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) ? "active" : "inactive",
    }));

    // Calculate summary statistics
    const totalCustomers = customerData.length;
    const activeCustomers = customerData.filter(customer => customer.status === "active").length;
    const totalRevenue = customerData.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const totalOrders = customerData.reduce((sum, customer) => sum + customer.totalOrders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json({
      summary: {
        totalCustomers,
        activeCustomers,
        totalRevenue,
        averageOrderValue,
        totalOrders,
      },
      customers: customerData,
    });
  } catch (error) {
    console.error("Franchise customer report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}