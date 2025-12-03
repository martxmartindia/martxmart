import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-helpers"

export async function GET() {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'VENDOR') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    return NextResponse.json(vendorProfile);
  } catch (error) {
    console.error("Error fetching vendor profile:", error)
    return NextResponse.json({ error: "Failed to fetch vendor profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'VENDOR') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json()

    // Get vendor profile
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    })

    if (!existingProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Update vendor profile
    const updatedProfile = await prisma.vendorProfile.update({
      where: { id: existingProfile.id },
      data: {
        businessName: data.businessName,
        businessType: data.businessType,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        website: data.website,
        gstNumber: data.gstin,
        panNumber: data.panNumber,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Error updating vendor profile:", error)
    return NextResponse.json({ error: "Failed to update vendor profile" }, { status: 500 })
  }
}