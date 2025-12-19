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
    const type = searchParams.get("type"); // "product" or "shopping"
    const lowStock = searchParams.get("lowStock") === "true";

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

    let inventory: any[] = [];
    let total = 0;

    if (!type || type === "product") {
      // Get product inventory
      const where: any = { franchiseId: franchise.id };
      if (lowStock) {
        where.quantity = { lte: prisma.productInventory.fields.minStock };
      }

      const [productInventory, productTotal] = await Promise.all([
        prisma.productInventory.findMany({
          where,
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                brand: true,
                modelNumber: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          skip: type ? skip : 0,
          take: type ? limit : undefined,
        }),
        prisma.productInventory.count({ where }),
      ]);

      inventory = [...inventory, ...productInventory.map(item => ({
        id: item.id,
        quantity: item.quantity,
        minStock: item.minStock,
        location: item.location,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: "product",
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          sku: item.product.modelNumber || item.product.id.slice(0, 8).toUpperCase(),
          category: item.product.category?.name || "Uncategorized",
          brand: item.product.brand,
        },
      }))];
      total += productTotal;
    }

    if (!type || type === "shopping") {
      // Get shopping inventory
      const where: any = { franchiseId: franchise.id };
      if (lowStock) {
        where.quantity = { lte: prisma.shoppingInventory.fields.minStock };
      }

      const [shoppingInventory, shoppingTotal] = await Promise.all([
        prisma.shoppingInventory.findMany({
          where,
          include: {
            shopping: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                brand: true,
                hsnCode: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          skip: type ? skip : 0,
          take: type ? limit : undefined,
        }),
        prisma.shoppingInventory.count({ where }),
      ]);

      inventory = [...inventory, ...shoppingInventory.map(item => ({
        id: item.id,
        quantity: item.quantity,
        minStock: item.minStock,
        location: item.location,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: "shopping",
        product: {
          id: item.shopping.id,
          name: item.shopping.name,
          price: Number(item.shopping.price),
          sku: item.shopping.hsnCode || item.shopping.id.slice(0, 8).toUpperCase(),
          category: item.shopping.category?.name || "Uncategorized",
          brand: item.shopping.brand,
        },
      }))];
      total += shoppingTotal;
    }

    // If no specific type, combine and paginate
    if (!type) {
      inventory = inventory
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(skip, skip + limit);
    }

    return NextResponse.json({
      inventory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Franchise inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { inventoryId, quantity, type } = body;

    if (!inventoryId || quantity === undefined || !type) {
      return NextResponse.json(
        { error: "Inventory ID, quantity, and type are required" },
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

    let result;

    if (type === "product") {
      result = await prisma.productInventory.updateMany({
        where: {
          id: inventoryId,
          franchiseId: franchise.id,
        },
        data: { quantity },
      });
    } else if (type === "shopping") {
      result = await prisma.shoppingInventory.updateMany({
        where: {
          id: inventoryId,
          franchiseId: franchise.id,
        },
        data: { quantity },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid inventory type" },
        { status: 400 }
      );
    }

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Inventory item not found or not accessible" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Inventory updated successfully",
    });
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}