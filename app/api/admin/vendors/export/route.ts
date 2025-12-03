import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
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