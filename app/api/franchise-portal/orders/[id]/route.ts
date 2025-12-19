import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "FRANCHISE") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: orderId } = await params;

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

        // Get order details
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { id: orderId },
                    { orderNumber: orderId },
                ],
                franchiseId: franchise.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                            },
                        },
                    },
                },
                shoppingItems: {
                    include: {
                        shopping: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                            },
                        },
                    },
                },
                shippingAddress: true,
                billingAddress: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Format order for frontend
        const formattedItems = [
            ...order.items.map(item => ({
                id: item.id,
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.price),
                total: Number(item.subtotal),
            })),
            ...order.shoppingItems.map(item => ({
                id: item.id,
                name: item.shopping.name,
                quantity: item.quantity,
                price: Number(item.price),
                total: Number(item.subtotal),
            })),
        ];

        const subtotal = formattedItems.reduce((sum, item) => sum + item.total, 0);
        // Tax and shipping costs are calculated as a portion of the difference
        const total = Number(order.totalAmount);
        const tax = Math.round((total - subtotal) * 0.6); // Estimate tax as 60% of non-subtotal amount
        const shipping = Math.round((total - subtotal) * 0.4); // Estimate shipping as 40% of non-subtotal amount

        return NextResponse.json({
            id: order.orderNumber,
            status: order.status,
            date: order.createdAt.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            customer: {
                id: order.user.id,
                name: order.user.name || "Unknown",
                email: order.user.email,
                phone: order.user.phone || "",
                address: order.shippingAddress
                    ? `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`
                    : "No address provided",
            },
            items: formattedItems,
            payment: {
                subtotal,
                tax: Math.max(0, tax),
                shipping: Math.max(0, shipping),
                total,
                method: "Card/UPI",
                cardNumber: "****",
            },
            shipping: {
                method: "Standard Delivery",
                trackingNumber: order.notes || "Not available",
                estimatedDelivery: new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
                deliveredOn: order.status === "DELIVERED" || order.status === "COMPLETED"
                    ? order.updatedAt.toLocaleDateString('en-IN')
                    : null,
            },
            timeline: [
                {
                    status: "Order Placed",
                    date: order.createdAt.toISOString(),
                    description: "Order has been placed successfully",
                },
                ...(order.status !== "PENDING" ? [{
                    status: "Processing",
                    date: order.updatedAt.toISOString(),
                    description: "Order is being processed",
                }] : []),
                ...(order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED" ? [{
                    status: "Shipped",
                    date: order.updatedAt.toISOString(),
                    description: "Order has been shipped",
                }] : []),
                ...(order.status === "DELIVERED" || order.status === "COMPLETED" ? [{
                    status: "Delivered",
                    date: order.updatedAt.toISOString(),
                    description: "Order has been delivered",
                }] : []),
            ].reverse(),
        });
    } catch (error) {
        console.error("Franchise order detail error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "FRANCHISE") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: orderId } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

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

        // Find the order first to get the actual ID
        const existingOrder = await prisma.order.findFirst({
            where: {
                OR: [
                    { id: orderId },
                    { orderNumber: orderId },
                ],
                franchiseId: franchise.id,
            },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Valid OrderStatus enum values
        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "COMPLETED"];
        const upperStatus = status.toUpperCase();

        if (!validStatuses.includes(upperStatus)) {
            return NextResponse.json(
                { error: `Invalid status. Valid values: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        // Update order status
        const order = await prisma.order.update({
            where: { id: existingOrder.id },
            data: { status: upperStatus },
        });

        return NextResponse.json({
            message: "Order status updated successfully",
            order: {
                id: order.orderNumber,
                status: order.status,
            },
        });
    } catch (error) {
        console.error("Update order status error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
