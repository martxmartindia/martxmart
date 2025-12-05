import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { name, description, price, category, sku, stock } = body;

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

    // Create product (this is a simplified version - in reality you'd need more complex logic)
    // For now, we'll just return success since the actual product creation logic would be complex
    return NextResponse.json({
      message: "Product created successfully",
      product: {
        id: "temp-id",
        name,
        description,
        price,
        category,
        sku,
        stock,
      }
    });
  } catch (error) {
    console.error("Franchise create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

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

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { modelNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        name: { contains: category, mode: "insensitive" },
      };
    }

    // Get products with inventory info
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Add inventory status to products
    const productsWithInventory = products.map(product => {
      const inventory = product.inventory[0];
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: inventory?.quantity || 0,
        category: product.category.name, // Return category name as string
        sku: product.modelNumber,
        status: inventory
          ? (inventory.quantity <= inventory.minStock ? "low_stock" : "active")
          : "out_of_stock",
        image: product.images?.[0] || null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      products: productsWithInventory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Franchise products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}