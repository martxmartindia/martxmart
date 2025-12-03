import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";


const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Check if user is authenticated
    const authError = await requireAuth();
    if (authError) return authError;

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const userRole = user.role;

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order belongs to user or user is admin
    if (order.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get shipping address
    const address = await prisma.address.findFirst({
      where: {
        userId: order.userId,
        type: "DISPATCH",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      order,
      address,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Check if user is admin
    const authError = await requireAuth();
    if (authError) return authError;

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { status } = await req.json();

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}