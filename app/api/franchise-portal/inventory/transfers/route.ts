import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Mock transfer model since it's not in the schema
interface InventoryTransfer {
  id: string;
  productId: string;
  productName: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  transferDate: Date;
  notes?: string;
  createdBy: string;
}

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

    // Get inventory transfers for this franchise
    // Since there's no Transfer model in the schema, we'll return mock data for now
    // In a real implementation, you'd have a Transfer model linked to the franchise
    const transfers: InventoryTransfer[] = [
      {
        id: "TRF-001",
        productId: "prod-1",
        productName: "CNC Lathe Machine",
        fromLocation: "Main Warehouse",
        toLocation: "Downtown Branch",
        quantity: 2,
        status: "completed",
        transferDate: new Date("2024-01-15"),
        notes: "Urgent delivery required",
        createdBy: session.user.name || "Franchise Owner",
      },
      {
        id: "TRF-002",
        productId: "prod-2",
        productName: "Tractor Engine",
        fromLocation: "Main Warehouse",
        toLocation: "Rural Branch",
        quantity: 1,
        status: "in_transit",
        transferDate: new Date("2024-01-14"),
        createdBy: session.user.name || "Franchise Owner",
      },
      {
        id: "TRF-003",
        productId: "prod-3",
        productName: "Concrete Mixer",
        fromLocation: "Downtown Branch",
        toLocation: "Construction Site",
        quantity: 3,
        status: "pending",
        transferDate: new Date("2024-01-13"),
        notes: "Site delivery",
        createdBy: session.user.name || "Franchise Owner",
      },
    ];

    return NextResponse.json({
      transfers,
      total: transfers.length,
    });
  } catch (error) {
    console.error("Franchise inventory transfers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, fromLocation, toLocation, quantity, notes } = body;

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Check if product exists in inventory
    const productInventory = await prisma.productInventory.findFirst({
      where: {
        productId: productId,
        franchiseId: franchise.id,
        quantity: {
          gte: quantity, // Ensure sufficient stock
        },
      },
      include: {
        product: true,
      },
    });

    if (!productInventory) {
      return NextResponse.json(
        { error: "Product not found in inventory or insufficient stock" },
        { status: 400 }
      );
    }

    // In a real implementation, you'd create a transfer record and update inventory
    // For now, we'll just return success
    const transfer: InventoryTransfer = {
      id: `TRF-${Date.now()}`,
      productId,
      productName: productInventory.product.name,
      fromLocation,
      toLocation,
      quantity,
      status: "pending",
      transferDate: new Date(),
      notes,
      createdBy: session.user.name || "Franchise Owner",
    };

    return NextResponse.json({
      message: "Transfer request created successfully",
      transfer,
    });
  } catch (error) {
    console.error("Franchise create transfer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}