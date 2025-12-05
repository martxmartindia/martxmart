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

    const { id: productId } = await params;

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

    // Get product with inventory info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        inventory: {
          where: {
            franchiseId: franchise.id,
          },
          select: {
            id: true,
            quantity: true,
            minStock: true,
            location: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const inventory = product.inventory[0];

    // Format product data for frontend
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: inventory?.quantity || 0,
      category: product.category.name,
      sku: product.modelNumber,
      status: inventory
        ? (inventory.quantity <= inventory.minStock ? "low_stock" : "active")
        : "out_of_stock",
      image: product.images?.[0] || null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      stockStatus: inventory
        ? (inventory.quantity <= inventory.minStock ? "low-stock" : "in-stock")
        : "out-of-stock",
      brand: product.brand || null,
      modelNumber: product.modelNumber || null,
      hsnCode: product.hsnCode || null,
      gstPercentage: product.gstPercentage || 18,
      dimensions: product.dimensions || null,
      weight: product.weight || null,
      specifications: product.specifications || null,
      images: product.images || [],
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Franchise product detail error:", error);
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

    const { id: productId } = await params;

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

    // Check if product exists and belongs to franchise's inventory
    const inventoryItem = await prisma.productInventory.findFirst({
      where: {
        productId: productId,
        franchiseId: franchise.id,
      },
    });

    if (!inventoryItem) {
      return NextResponse.json(
        { error: "Product not found in your inventory" },
        { status: 404 }
      );
    }

    // Delete inventory item (soft delete or just remove from franchise inventory)
    await prisma.productInventory.delete({
      where: { id: inventoryItem.id },
    });

    return NextResponse.json({ message: "Product removed from inventory" });
  } catch (error) {
    console.error("Franchise delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}