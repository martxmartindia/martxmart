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

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get vendor by user ID (since frontend passes user ID)
    const vendor = await prisma.vendorProfile.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        documents: true,
      },
    })

    if (!vendor) {
      // Check if user exists at all
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        }
      })
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      
      // User exists but no vendor profile - this is valid for potential vendors
      return NextResponse.json({
        error: "Vendor profile not found. Please create a vendor profile first.",
        user: user
      }, { status: 404 })
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

    // Get vendor by user ID (since frontend passes user ID)
    const existingVendor = await prisma.vendorProfile.findFirst({
      where: { userId: id },
      include: {
        user: true,
      },
    })

    // Update or create vendor profile
    let vendor;
    
    if (existingVendor) {
      // Update existing vendor profile
      vendor = await prisma.vendorProfile.update({
        where: { id: existingVendor.id },
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
          gstNumber: data.gstNumber,
          panNumber: data.panNumber,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          category: data.category,
          experience: data.experience,
          annualTurnover: data.annualTurnover,
          employeeCount: data.employeeCount,
          certifications: data.certifications || [],
          specializations: data.specializations || [],
          serviceAreas: data.serviceAreas || [],
          // status: data.status,
          isVerified: data.status === "APPROVED"
        },
        include: {
          user: true,
          documents: true,
        }
      });
    } else {
      // Create new vendor profile
      vendor = await prisma.vendorProfile.create({
        data: {
          userId: id,
          businessName: data.businessName,
          businessType: data.businessType,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone,
          email: data.email,
          website: data.website,
          gstNumber: data.gstNumber,
          panNumber: data.panNumber,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          category: data.category,
          experience: data.experience,
          annualTurnover: data.annualTurnover,
          employeeCount: data.employeeCount,
          certifications: data.certifications || [],
          specializations: data.specializations || [],
          serviceAreas: data.serviceAreas || [],
          status: data.status || "PENDING",
          isVerified: data.status === "APPROVED",
          isActive: true
        },
        include: {
          user: true,
          documents: true,
        }
      });
    }

    // Update user information if provided
    if (data.name || data.email || data.phone) {
      await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      })
    }

    // If status is changed to APPROVED, update user role to VENDOR
    if (data.status === "APPROVED" && (!existingVendor || !existingVendor.isVerified)) {
      await prisma.user.update({
        where: { id },
        data: { role: "VENDOR" },
      })
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

