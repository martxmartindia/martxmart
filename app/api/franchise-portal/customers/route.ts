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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

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

    // Build where clause for customers who have ordered from this franchise
    const where: any = {
      orders: {
        some: {
          franchiseId: franchise.id,
        },
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get customers with their order statistics
    const customers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        orders: {
          where: {
            franchiseId: franchise.id,
          },
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
        addresses: {
          select: {
            id: true,
            city: true,
            state: true,
            zip: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Calculate customer statistics
    const customersWithStats = customers.map(customer => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const completedOrders = customer.orders.filter(order => order.status === "DELIVERED" || order.status === "COMPLETED").length;
      const lastOrderDate = customer.orders.length > 0
        ? customer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isVerified: customer.isVerified,
        createdAt: customer.createdAt,
        addresses: customer.addresses,
        stats: {
          totalOrders,
          totalSpent,
          completedOrders,
          lastOrderDate,
        },
      };
    });

    const total = await prisma.user.count({
      where: {
        orders: {
          some: {
            franchiseId: franchise.id,
          },
        },
      },
    });

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Franchise customers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}