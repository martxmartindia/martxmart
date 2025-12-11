import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
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
            phone: true,
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
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
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

    // Update vendor profile fields (using correct schema field names)
    const vendorUpdateData: any = {}
    if (data.businessName !== undefined) vendorUpdateData.businessName = data.businessName
    if (data.panNumber !== undefined) vendorUpdateData.panNumber = data.panNumber
    if (data.businessType !== undefined) vendorUpdateData.businessType = data.businessType
    if (data.gstin !== undefined) vendorUpdateData.gstNumber = data.gstin // Fixed: gstNumber not gstin
    if (data.status !== undefined) {
      vendorUpdateData.status = data.status.toUpperCase()
      vendorUpdateData.isVerified = data.status.toUpperCase() === "ACTIVE" // Fixed: ACTIVE not APPROVED
    }

    const vendor = await prisma.vendorProfile.update({
      where: { id },
      data: vendorUpdateData,
    })

    // Update user profile fields if provided
    const userUpdateData: any = {}
    if (data.name !== undefined) userUpdateData.name = data.name
    if (data.email !== undefined) userUpdateData.email = data.email
    if (data.phone !== undefined) userUpdateData.phone = data.phone

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: existingVendor.userId },
        data: userUpdateData,
      })
    }

    // Handle role changes based on status (using correct enum values)
    if (data.status.toUpperCase() === "ACTIVE" && !existingVendor.isVerified) {
      await prisma.user.update({
        where: { id: existingVendor.userId },
        data: { role: "VENDOR" },
      })
    } else if (data.status.toUpperCase() !== "ACTIVE" && existingVendor.isVerified) {
      await prisma.user.update({
        where: { id: existingVendor.userId },
        data: { role: "CUSTOMER" },
      })
    }

    // Return updated vendor with user data
    const updatedVendor = await prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json({ vendor: updatedVendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}
