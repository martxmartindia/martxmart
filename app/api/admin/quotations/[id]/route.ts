import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params 
  try {
    // Check if user is authenticated
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-expect-error - JWT payload type is dynamic
    const userId = decoded.id
    // @ts-expect-error - JWT payload type is dynamic
    const userRole = decoded.role

    const quotationId = id

    // Get quotation details
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }

    // Check if user is admin or the quotation owner
    if (userRole !== "ADMIN" && quotation.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ quotation })
  } catch (error) {
    console.error("Error fetching quotation:", error)
    return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params 
  try {
    // Check if user is admin
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || (await decoded).payload.id !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quotationId =id
    const { status } = await req.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Update quotation status
    const quotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status },
    })

    return NextResponse.json(quotation)
  } catch (error) {
    console.error("Error updating quotation:", error)
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 })
  }
}

