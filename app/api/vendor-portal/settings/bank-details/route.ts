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

    // Get vendor profile to check if bank details are stored there
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId },
      select: {
        bankName: true,
        accountNumber: true,
        ifscCode: true,
        isVerified: true,
        updatedAt: true
      }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Return bank details from vendor profile (mask account number for security)
    const bankDetails = {
      id: "VENDOR-BANK",
      accountHolderName: "As per business registration", // This would come from business registration data
      bankName: vendorProfile.bankName || "",
      accountNumber: vendorProfile.accountNumber ? `****${vendorProfile.accountNumber.slice(-4)}` : "",
      ifscCode: vendorProfile.ifscCode || "",
      accountType: "Business Current", // Default account type
      isVerified: vendorProfile.isVerified,
      verifiedAt: vendorProfile.isVerified ? vendorProfile.updatedAt : null,
    }

    return NextResponse.json(bankDetails)

  } catch (error) {
    console.error("Error fetching bank details:", error)
    return NextResponse.json({ error: "Failed to fetch bank details" }, { status: 500 })
  }
}

export async function POST(req: Request) {
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

    const { accountHolderName, bankName, accountNumber, ifscCode, accountType } = data

    // Validate required fields
    if (!accountHolderName || !bankName || !accountNumber || !ifscCode || !accountType) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 })
    }

    // Save bank details to vendor profile
    const updatedVendorProfile = await prisma.vendorProfile.update({
      where: { userId: vendorId },
      data: {
        bankName,
        accountNumber,
        ifscCode,
        isVerified: false, // Bank details need verification
        updatedAt: new Date()
      }
    })

    // Return masked bank details for security
    const bankDetails = {
      id: "VENDOR-BANK",
      accountHolderName: "As per business registration",
      bankName: updatedVendorProfile.bankName,
      accountNumber: updatedVendorProfile.accountNumber ? `****${updatedVendorProfile.accountNumber.slice(-4)}` : "",
      ifscCode: updatedVendorProfile.ifscCode,
      accountType,
      isVerified: updatedVendorProfile.isVerified,
      verifiedAt: null,
    }

    return NextResponse.json({
      message: "Bank details updated successfully",
      bankDetails
    })

  } catch (error) {
    console.error("Error updating bank details:", error)
    return NextResponse.json({ error: "Failed to update bank details" }, { status: 500 })
  }
}