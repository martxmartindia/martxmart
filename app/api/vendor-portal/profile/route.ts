import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id

    // Get vendor profile with vendor details
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
      include: {
        vendorProfile: {
          include: {
            documents: true,
          }
        }
      }
    })

    if (!vendor || vendor.role !== "VENDOR") {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    const profile = {
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      image: vendor.image,
      isVerified: vendor.isVerified,
      createdAt: vendor.createdAt,
      vendorProfile: vendor.vendorProfile ? {
        id: vendor.vendorProfile.id,
        businessName: vendor.vendorProfile.businessName,
        businessType: vendor.vendorProfile.businessType,
        gstNumber: vendor.vendorProfile.gstNumber,
        panNumber: vendor.vendorProfile.panNumber,
        address: vendor.vendorProfile.address,
        city: vendor.vendorProfile.city,
        state: vendor.vendorProfile.state,
        pincode: vendor.vendorProfile.pincode,
        isVerified: vendor.vendorProfile.isVerified,
        documents: vendor.vendorProfile.documents.map(doc => ({
          id: doc.id,
          type: doc.documentType,
          url: doc.documentUrl,
          status: doc.isVerified ? 'VERIFIED' : 'PENDING',
          uploadedAt: doc.createdAt,
        })),
      } : null,
    }

    return NextResponse.json(profile)

  } catch (error) {
    console.error("Error fetching vendor profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id
    const data = await req.json()

    // Update user basic info
    const { name, phone, image } = data

    const updatedUser = await prisma.user.update({
      where: { id: vendorId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(image && { image }),
      },
      include: {
        vendorProfile: {
          include: {
            documents: true,
          }
        }
      }
    })

    // Update vendor profile if provided
    if (data.vendorProfile) {
      const { businessName, businessType, gstNumber, panNumber, address, city, state, pincode } = data.vendorProfile

      await prisma.vendorProfile.updateMany({
        where: { userId: vendorId },
        data: {
          ...(businessName && { businessName }),
          ...(businessType && { businessType }),
          ...(gstNumber && { gstNumber }),
          ...(panNumber && { panNumber }),
          ...(address && { address }),
          ...(city && { city }),
          ...(state && { state }),
          ...(pincode && { pincode }),
        }
      })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
      }
    })

  } catch (error) {
    console.error("Error updating vendor profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
