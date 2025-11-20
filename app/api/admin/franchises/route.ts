import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET(req: Request) {
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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const isActive = searchParams.get("isActive")

    // Build query
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    // Fetch franchises
    const franchises = await prisma.franchise.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format response
    const formattedFranchises = franchises.map((franchise) => ({
      id: franchise.id,
      name: franchise.name,
      ownerId: franchise.ownerId,
      ownerName: franchise.owner.name,
      status: franchise.status,
      commissionRate: franchise.commissionRate,
      isActive: franchise.isActive,
      createdAt: franchise.createdAt,
    }))

    return NextResponse.json({ franchises: formattedFranchises })
  } catch (error) {
    console.error("Error fetching franchises:", error)
    return NextResponse.json({ error: "Failed to fetch franchises" }, { status: 500 })
  }
}

export async function POST(req: Request) {
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
    const {
      name,
      ownerId,
      businessAddress,
      contactEmail,
      contactPhone,
      gstNumber,
      panNumber,
      territory,
      district,
      state,
      investmentSlab,
      commissionRate,
      contractStartDate,
      contractEndDate,
    } = body

    // Validate required fields
    if (!name || !ownerId || !businessAddress || !contactEmail || !contactPhone || !territory) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    })

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 })
    }

    // Create franchise
    const franchise = await prisma.franchise.create({
      data: {
        name,
        ownerId,
        businessAddress,
        contactEmail,
        contactPhone,
        gstNumber,
        panNumber,
        district:district,
        state:state,
        investmentSlab:investmentSlab,
        commissionRate: commissionRate || 10.0,
        contractStartDate: contractStartDate ? new Date(contractStartDate) : null,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
        status: "APPROVED",
        isActive: true,
      },
    })

    return NextResponse.json({ franchise })
  } catch (error) {
    console.error("Error creating franchise:", error)
    return NextResponse.json({ error: "Failed to create franchise" }, { status: 500 })
  }
}

