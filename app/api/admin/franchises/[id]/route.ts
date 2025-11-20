import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch franchise
    const franchise = await prisma.franchise.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
       
      },
    })

    if (!franchise) {
      return NextResponse.json({ error: "Franchise not found" }, { status: 404 })
    }

    return NextResponse.json({ franchise })
  } catch (error) {
    console.error("Error fetching franchise:", error)
    return NextResponse.json({ error: "Failed to fetch franchise" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Update franchise
    const updatedFranchise = await prisma.franchise.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ franchise: updatedFranchise })
  } catch (error) {
    console.error("Error updating franchise:", error)
    return NextResponse.json({ error: "Failed to update franchise" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Delete franchise
    await prisma.franchise.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting franchise:", error)
    return NextResponse.json({ error: "Failed to delete franchise" }, { status: 500 })
  }
}

