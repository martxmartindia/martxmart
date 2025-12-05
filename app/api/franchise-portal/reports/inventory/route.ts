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

    // Get all products in franchise inventory
    const productInventory = await prisma.productInventory.findMany({
      where: { franchiseId: franchise.id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const shoppingInventory = await prisma.shoppingInventory.findMany({
      where: { franchiseId: franchise.id },
      include: {
        shopping: {
          include: {
            category: true,
          },
        },
      },
    });

    // Combine and format inventory data
    const inventoryData = [
      ...productInventory.map(item => ({
        product: item.product.name,
        sku: item.product.modelNumber || `PROD-${item.productId.slice(-6)}`,
        currentStock: item.quantity,
        minStock: item.minStock,
        maxStock: Math.max(item.minStock * 3, 20), // Estimate max stock
        status: item.quantity === 0 ? "out_of_stock" :
                item.quantity <= item.minStock ? "low_stock" : "in_stock",
        lastUpdated: item.updatedAt.toISOString().split('T')[0],
      })),
      ...shoppingInventory.map(item => ({
        product: item.shopping.name,
        sku: item.shopping.hsnCode || `SHOP-${item.shoppingId.slice(-6)}`,
        currentStock: item.quantity,
        minStock: item.minStock,
        maxStock: Math.max(item.minStock * 3, 20), // Estimate max stock
        status: item.quantity === 0 ? "out_of_stock" :
                item.quantity <= item.minStock ? "low_stock" : "in_stock",
        lastUpdated: item.updatedAt.toISOString().split('T')[0],
      })),
    ];

    // Calculate summary statistics
    const totalProducts = inventoryData.length;
    const inStockProducts = inventoryData.filter(item => item.status === "in_stock").length;
    const lowStockProducts = inventoryData.filter(item => item.status === "low_stock").length;
    const outOfStockProducts = inventoryData.filter(item => item.status === "out_of_stock").length;

    // Calculate total value (mock calculation based on stock levels)
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.currentStock * 1000), 0);

    return NextResponse.json({
      summary: {
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        totalValue,
      },
      inventory: inventoryData,
    });
  } catch (error) {
    console.error("Franchise inventory report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}