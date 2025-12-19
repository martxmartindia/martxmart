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
      // Return default profile for new vendors
      return NextResponse.json({
        id: vendorId,
        name: session.user.name || "Vendor",
        email: session.user.email || "",
        phone: "",
        businessName: "New Business",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        profileImage: "",
        joinedDate: new Date().toISOString(),
        isVerified: false,
        rating: 0,
        totalReviews: 0,
        businessLicense: "",
        taxId: "",
        // For settings page
        vendor: {
          id: vendorId,
          businessName: "New Business",
          businessType: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
          email: session.user.email || "",
          website: "",
          gstNumber: "",
          panNumber: "",
          user: {
            name: session.user.name || "Vendor",
            email: session.user.email || "",
            image: "",
          }
        }
      })
    }

    // Format for profile page (flat structure)
    const profile = {
      id: vendor.id,
      name: vendor.name || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      businessName: vendor.vendorProfile?.businessName || "My Business",
      address: vendor.vendorProfile?.address || "",
      city: vendor.vendorProfile?.city || "",
      state: vendor.vendorProfile?.state || "",
      zipCode: vendor.vendorProfile?.pincode || "",
      country: "India",
      profileImage: vendor.image || "",
      joinedDate: vendor.createdAt.toISOString(),
      isVerified: vendor.vendorProfile?.isVerified || false,
      rating: vendor.vendorProfile?.rating || 4.5,
      totalReviews: vendor.vendorProfile?.totalOrders || 0,
      businessLicense: "",
      taxId: vendor.vendorProfile?.gstNumber || "",
      // For settings page
      vendor: vendor.vendorProfile ? {
        id: vendor.vendorProfile.id,
        businessName: vendor.vendorProfile.businessName,
        businessType: vendor.vendorProfile.businessType || "",
        address: vendor.vendorProfile.address || "",
        city: vendor.vendorProfile.city || "",
        state: vendor.vendorProfile.state || "",
        pincode: vendor.vendorProfile.pincode || "",
        phone: vendor.vendorProfile.phone || vendor.phone || "",
        email: vendor.vendorProfile.email || vendor.email || "",
        website: vendor.vendorProfile.website || "",
        gstNumber: vendor.vendorProfile.gstNumber || "",
        panNumber: vendor.vendorProfile.panNumber || "",
        user: {
          name: vendor.name || "",
          email: vendor.email || "",
          image: vendor.image || "",
        }
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

    // Update user basic info (supports both profile page and settings page formats)
    const name = data.name || data.user?.name
    const phone = data.phone
    const image = data.profileImage || data.image || data.user?.image

    await prisma.user.update({
      where: { id: vendorId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(image && { image }),
      },
    })

    // Get or create vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    // Extract vendor profile data from either flat fields or nested vendor object
    const vendorData = data.vendor || data.vendorProfile || data
    const businessName = vendorData.businessName || data.businessName
    const businessType = vendorData.businessType
    const gstNumber = vendorData.gstNumber || data.taxId
    const panNumber = vendorData.panNumber
    const address = vendorData.address || data.address
    const city = vendorData.city || data.city
    const state = vendorData.state || data.state
    const pincode = vendorData.pincode || data.zipCode
    const website = vendorData.website
    const email = vendorData.email || data.email
    const vendorPhone = vendorData.phone || data.phone

    if (vendorProfile) {
      // Update existing vendor profile
      await prisma.vendorProfile.update({
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
          ...(website && { website }),
          ...(email && { email }),
          ...(vendorPhone && { phone: vendorPhone }),
          updatedAt: new Date(),
        }
      })
    } else if (businessName) {
      // Create new vendor profile if businessName is provided
      await prisma.vendorProfile.create({
        data: {
          userId: vendorId,
          businessName: businessName || "My Business",
          businessType: businessType || "Retail",
          address: address || "",
          city: city || "",
          state: state || "",
          pincode: pincode || "",
          phone: vendorPhone || "",
          email: email || session.user.email || "",
          website: website || "",
          gstNumber: gstNumber || "",
          panNumber: panNumber || "",
        }
      })
    }

    // Return success response matching frontend expectation
    return NextResponse.json({
      message: "Profile updated successfully",
      id: vendorId,
      name: name || session.user.name,
      email: session.user.email,
      phone: phone || "",
      businessName: businessName || "My Business",
    })

  } catch (error) {
    console.error("Error updating vendor profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
