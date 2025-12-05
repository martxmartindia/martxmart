import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Mock adjustment model since it's not in the schema
interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: 'increase' | 'decrease';
  quantity: number;
  reason: string;
  previousStock: number;
  newStock: number;
  adjustmentDate: Date;
  performedBy: string;
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

    // Since there's no Adjustment model in the schema, return empty array for now
    // In a real implementation, you'd have an Adjustment model linked to the franchise
    const adjustments: InventoryAdjustment[] = [];

    return NextResponse.json({
      adjustments,
      total: adjustments.length,
    });
  } catch (error) {
    console.error("Franchise inventory adjustments error:", error);
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
    const { productId, type, quantity, reason } = body;

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
      },
      include: {
        product: true,
      },
    });

    if (!productInventory) {
      return NextResponse.json(
        { error: "Product not found in inventory" },
        { status: 404 }
      );
    }

    const previousStock = productInventory.quantity;
    let newStock: number;

    if (type === 'increase') {
      newStock = previousStock + quantity;
    } else if (type === 'decrease') {
      if (previousStock < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock for decrease adjustment" },
          { status: 400 }
        );
      }
      newStock = previousStock - quantity;
    } else {
      return NextResponse.json(
        { error: "Invalid adjustment type" },
        { status: 400 }
      );
    }

    // Update inventory
    await prisma.productInventory.update({
      where: { id: productInventory.id },
      data: { quantity: newStock },
    });

    const adjustment: InventoryAdjustment = {
      id: `ADJ-${Date.now()}`,
      productId,
      productName: productInventory.product.name,
      type: type as 'increase' | 'decrease',
      quantity,
      reason,
      previousStock,
      newStock,
      adjustmentDate: new Date(),
      performedBy: session.user.name || "Franchise Owner",
    };

    return NextResponse.json({
      message: "Inventory adjustment completed successfully",
      adjustment,
    });
  } catch (error) {
    console.error("Franchise create adjustment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}