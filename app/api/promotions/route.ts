import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"
// GET promotion requests
export async function GET(request: Request) {
  try {
    const token=(await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyJWT(token)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.payload.id
    const role=user.payload.role

    const { searchParams } = new URL(request.url)
    const franchiseId = searchParams.get("franchiseId")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    // Build where clause
    const whereClause: any = {}

    if (franchiseId) {
      whereClause.franchiseId = franchiseId

      // If not admin, check if user belongs to this franchise
      if (role !== "ADMIN") {
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
      // Admin can see all promotion requests
    } else {
      // Non-admin users can only see promotion requests from their franchise
      const userFranchises = await db.franchise.findMany({
        where: {
          OR: [
            { ownerId: userId as string},
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

    if (status) {
      whereClause.status = status
    }

    if (type) {
      whereClause.type = type
    }

    const promotions = await db.promotionRequest.findMany({
      where: whereClause,
      include: {
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
        createdAt: "desc",
      },
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error("Error fetching promotion requests:", error)
    return NextResponse.json({ error: "Failed to fetch promotion requests" }, { status: 500 })
  }
}

// POST create a new promotion request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, type, materials, notes, franchiseId } = body

    const token=(await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyJWT(token)
    const userId = user.payload.id
    const role=user.payload.role
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate required fields
    if (!title || !description || !type || !franchiseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user has permission to create promotion request for this franchise
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
          path: ["promotions", "create"],
          equals: true,
        },
      },
    })

    if (!isAdmin && !isFranchiseOwner && !isFranchiseStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create the promotion request
    const promotion = await db.promotionRequest.create({
      data: {
        title,
        description,
        type,
        materials: materials || [],
        notes,
        franchiseId,
      },
    })

    // Create notification for admin
    await db.notification.create({
      data: {
        title: "New Promotion Request",
        message: `A new promotion request "${title}" has been submitted by ${user.payload.name}.`,
        type: "PROMOTION",
        userId: userId as string,
        franchiseId,
      },
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error creating promotion request:", error)
    return NextResponse.json({ error: "Failed to create promotion request" }, { status: 500 })
  }
}
