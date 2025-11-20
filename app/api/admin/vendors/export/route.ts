import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/utils/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all vendors with their details
    const vendors = await prisma.vendorProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    })

    // Transform data into CSV format
    const csvHeader = [
      "Name",
      "Email",
      "Phone",
      "Business Name",
      "Business Type",
      "GSTIN",
      "PAN Number",
      "Verification Status",
      "Registration Date",
    ].join(",")

    const csvRows = vendors.map((vendor) => {
      return [
        vendor.user.name,
        vendor.user.email,
        vendor.user.phone || "",
        vendor.businessName,
        vendor.businessType,
        vendor.gstNumber || "",
        vendor.panNumber || "",
        vendor.user.isVerified ? "Verified" : "Pending",
        new Date(vendor.user.createdAt).toLocaleDateString(),
      ]
        .map((field) => `"${field?.toString().replace(/"/g, '""')}"`) // Escape quotes and wrap fields
        .join(",")
    })

    const csv = [csvHeader, ...csvRows].join("\n")

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=vendors-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Error exporting vendors:", error)
    return NextResponse.json({ error: "Failed to export vendors" }, { status: 500 })
  }
}