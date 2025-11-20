import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token and extract the user ID
    const decodedToken =await verifyJWT(token)

    const userId= decodedToken.payload.userId

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId:userId as string },
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
const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token and extract the user ID
    const decodedToken =await verifyJWT(token)

    const userId= decodedToken.payload.userId
    const data = await request.json()

    // Get vendor profile
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId:userId as string },
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