import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET(request: NextRequest,
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


    // Get vendor
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 })
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

    // Get request body
    const data = await req.json()

    // Get vendor to check if it exists
    const existingVendor = await prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!existingVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Update vendor
    const vendor = await prisma.vendorProfile.update({
      where: { id },
      data: {
        businessName: data.businessName,
        panNumber: data.panNumber,
        // status: data.status,
        isVerified: data.status === "APPROVED"
      },
    })

    // If status is changed to APPROVED, update user role to VENDOR
    if (data.status === "APPROVED" && !existingVendor.isVerified) {
      await prisma.user.update({
        where: { id: existingVendor.userId },
        data: { role: "VENDOR" },
      })
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

