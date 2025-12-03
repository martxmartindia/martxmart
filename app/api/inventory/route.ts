import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"

// GET inventory items
export async function GET(request: Request) {
  try {
 const auth=await requireAuth();
    if (auth instanceof NextResponse) return  auth;
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const role = user.role;

    const { searchParams } = new URL(request.url)
    const franchiseId = searchParams.get("franchiseId")
    const lowStock = searchParams.get("lowStock") === "true"
    const productId = searchParams.get("productId")

    // Build where clause
    const whereClause: any = {}

    if (franchiseId) {
      whereClause.franchiseId = franchiseId

      // If not admin, check if user belongs to this franchise
      if (role!== "ADMIN") {
        const isFranchiseOwner = await db.franchise.findFirst({
          where: {
            id: franchiseId,
            ownerId: userId as string,
          },
        })

        const isFranchiseStaff = await db.franchiseStaff.findFirst({
          where: {
            franchiseId,
            userId: userId as string,
          },
        })

        if (!isFranchiseOwner && !isFranchiseStaff) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
      }
    } else if (role === "ADMIN") {
      // Admin can see all inventory
    } else {
      // Non-admin users can only see inventory from their franchise
      const userFranchises = await db.franchise.findMany({
        where: {
          OR: [
            { ownerId: userId as string  },
            {
              staff: {
                some: {
                  userId: userId as string,
                },
              },
            },
          ],
        },
        select: { id: true },
      })

      if (userFranchises.length === 0) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      whereClause.franchiseId = {
        in: userFranchises.map((f) => f.id),
      }
    }

    if (lowStock) {
      whereClause.quantity = {
        lte: {
          ref: 'minStock'
        }
      }
    }

    if (productId) {
      whereClause.productId = productId
    }

    const inventory = await db.productInventory.findMany({
      where: whereClause,
      include: {
        product: true,
        franchise: {
          select: {
            id: true,
            name: true,
            district: true,
            state: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

// POST create or update inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, franchiseId, quantity, minStock, location } = body
    const user = await getAuthenticatedUser()
    const userId = user?.id
    const role = user?.role

    // Validate required fields
    if (!productId || !franchiseId) {
      return NextResponse.json({ error: "Product ID and franchise ID are required" }, { status: 400 })
    }

    // Check if user has permission to manage inventory for this franchise
    const isAdmin = role === "ADMIN"
    const isFranchiseOwner = await db.franchise.findFirst({
      where: {
        id: franchiseId,
        ownerId: userId as string,
      },
    })

    const isFranchiseStaff = await db.franchiseStaff.findFirst({
      where: {
        franchiseId,
        userId: userId as string,
        permissions: {
          path: ["inventory", "update"],
          equals: true,
        },
      },
    })

    if (!isAdmin && !isFranchiseOwner && !isFranchiseStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if inventory item already exists
    const existingInventory = await db.productInventory.findFirst({
      where: {
        productId,
        franchiseId,
      },
    })

    let inventoryItem

    if (existingInventory) {
      // Update existing inventory
      inventoryItem = await db.productInventory.update({
        where: { id: existingInventory.id },
        data: {
          quantity: quantity !== undefined ? quantity : existingInventory.quantity,
          minStock: minStock !== undefined ? minStock : existingInventory.minStock,
          location: location || existingInventory.location,
        },
        include: {
          product: true,
        },
      })
    } else {
      // Create new inventory item
      inventoryItem = await db.productInventory.create({
        data: {
          productId,
          franchiseId,
          quantity: quantity || 0,
          minStock: minStock || 5,
          location: location || "Main Warehouse",
        },
        include: {
          product: true,
        },
      })
    }

    // Check if inventory is low and create notification if needed
    if (inventoryItem.quantity <= inventoryItem.minStock) {
      const franchise = await db.franchise.findUnique({
        where: { id: franchiseId },
      })

      if (franchise) {
        await db.notification.create({
          data: {
            title: "Low Inventory Alert",
            message: `Inventory for ${inventoryItem.product.name} is low (${inventoryItem.quantity} remaining).`,
            type: "INVENTORY",
            userId: franchise.ownerId,
            franchiseId,
          },
        })
      }
    }

    return NextResponse.json(inventoryItem)
  } catch (error) {
    console.error("Error managing inventory:", error)
    return NextResponse.json({ error: "Failed to manage inventory" }, { status: 500 })
  }
}
