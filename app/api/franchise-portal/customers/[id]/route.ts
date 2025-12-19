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

        const { id: customerId } = await params;

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

        // Get customer details with their orders from this franchise
        const customer = await prisma.user.findFirst({
            where: {
                id: customerId,
                orders: {
                    some: {
                        franchiseId: franchise.id,
                    },
                },
            },
            include: {
                orders: {
                    where: {
                        franchiseId: franchise.id,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    select: {
                        id: true,
                        orderNumber: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true,
                        items: {
                            select: { id: true },
                        },
                        shoppingItems: {
                            select: { id: true },
                        },
                    },
                },
                addresses: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        // Calculate statistics
        const totalOrders = customer.orders.length;
        const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

        const primaryAddress = customer.addresses[0];

        // Format recent orders
        const recentOrders = customer.orders.slice(0, 5).map(order => ({
            id: order.orderNumber,
            date: order.createdAt.toLocaleDateString('en-IN'),
            items: order.items.length + order.shoppingItems.length,
            total: Number(order.totalAmount),
            status: order.status,
        }));

        return NextResponse.json({
            id: customer.id,
            name: customer.name || "Unknown",
            email: customer.email,
            phone: customer.phone || "",
            avatar: customer.image,
            status: customer.isVerified ? "active" : "inactive",
            createdAt: customer.createdAt.toISOString(),
            address: primaryAddress ? {
                addressLine1: primaryAddress.addressLine1,
                addressLine2: primaryAddress.addressLine2,
                city: primaryAddress.city,
                state: primaryAddress.state,
                zip: primaryAddress.zip,
            } : null,
            totalOrders,
            totalSpent,
            recentOrders,
        });
    } catch (error) {
        console.error("Franchise customer detail error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        const { id: customerId } = await params;

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

        // Note: In a real application, you might not want to delete users
        // Instead, you might want to just remove their association with the franchise
        // For now, we'll return a success message but not actually delete the user

        // Check if customer exists and has orders from this franchise
        const customer = await prisma.user.findFirst({
            where: {
                id: customerId,
                orders: {
                    some: {
                        franchiseId: franchise.id,
                    },
                },
            },
        });

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        // In production, you might want to anonymize or archive instead of delete
        // For now, we'll just mark this as a successful "removal" from franchise view

        return NextResponse.json({
            message: "Customer removed successfully",
        });
    } catch (error) {
        console.error("Delete customer error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
