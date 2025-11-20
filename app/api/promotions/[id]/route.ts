import { NextRequest, NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

// GET a specific promotion request
export async function GET( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    
  const id = (await params).id;
    const promotionId =id
const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyJWT(token)
    const userId = user?.payload?.id // Assuming user is an object with a payload property containing user information
   const role = user?.payload?.role // Assuming user is an object with a payload property containing user information
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const promotion = await db.promotionRequest.findUnique({
      where: { id: promotionId },
      include: {
        franchise: {
          select: {
            id: true,
            name: true,
            district: true,
            state: true,
            ownerId: true,
          },
        },
      },
    })

    if (!promotion) {
      return NextResponse.json({ error: "Promotion request not found" }, { status: 404 })
    }

    // Check if user has permission to view this promotion request
    const isAdmin = role === "ADMIN"
    const isFranchiseOwner = promotion.franchise.ownerId === userId

    const isFranchiseStaff = await db.franchiseStaff.findFirst({
      where: {
        franchiseId: promotion.franchiseId,
        userId: userId as string,
      },
    })

    if (!isAdmin && !isFranchiseOwner && !isFranchiseStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error fetching promotion request:", error)
    return NextResponse.json({ error: "Failed to fetch promotion request" }, { status: 500 })
  }
}

// PATCH update a promotion request
export async function PATCH( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    
  const id = (await params).id;
    const promotionId = id
    const body = await request.json()

    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyJWT(token)
    const userId = user?.payload?.id // Assuming user is an object with a payload property containing user information
    const role = user?.payload?.role // Assuming user is an object with a payload property containing user information
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const promotion = await db.promotionRequest.findUnique({
      where: { id: promotionId },
      include: {
        franchise: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!promotion) {
      return NextResponse.json({ error: "Promotion request not found" }, { status: 404 })
    }

    // Check if user has permission to update this promotion request
    const isAdmin = role === "ADMIN"
    const isFranchiseOwner = promotion.franchise.ownerId === userId

    const isFranchiseStaff = await db.franchiseStaff.findFirst({
      where: {
        franchiseId: promotion.franchiseId,
        userId: userId as string,
        permissions: {
          path: ["promotions", "update"],
          equals: true,
        },
      },
    })

    if (!isAdmin && !isFranchiseOwner && !isFranchiseStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If admin is updating status, handle separately
    if (isAdmin && body.status) {
      const { status } = body

      const updatedPromotion = await db.promotionRequest.update({
        where: { id: promotionId },
        data: { status },
      })

      // Create notification for franchise owner
      await db.notification.create({
        data: {
          title: "Promotion Request Status Updated",
          message: `Your promotion request "${promotion.title}" status has been updated to ${status}.`,
          type: "PROMOTION_STATUS",
          userId: promotion.franchise.ownerId,
          franchiseId: promotion.franchiseId,
        },
      })

      return NextResponse.json(updatedPromotion)
    }

    // For franchise owner/staff updates
    const { title, description, type, materials, notes } = body

    const updatedPromotion = await db.promotionRequest.update({
      where: { id: promotionId },
      data: {
        title,
        description,
        type,
        materials,
        notes,
      },
    })

    return NextResponse.json(updatedPromotion)
  } catch (error) {
    console.error("Error updating promotion request:", error)
    return NextResponse.json({ error: "Failed to update promotion request" }, { status: 500 })
  }
}
