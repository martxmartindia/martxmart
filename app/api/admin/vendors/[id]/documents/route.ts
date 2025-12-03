import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request,  { params }: { params: Promise<{ id: string }> })
{  const { id} = await params
  try {
    // Check if user is admin or the vendor
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role

    const vendorId =id

    // Get vendor
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Check if user is admin or the vendor
    if (userRole !== "ADMIN" && vendor.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { documentType, documentUrl } = await req.json()

    if (!documentType || !documentUrl) {
      return NextResponse.json({ error: "Document type and URL are required" }, { status: 400 })
    }

    // Create document
    const document = await prisma.vendorDocument.create({
      data: {
        vendorProfileId: vendorId,
        documentType,
        documentUrl,
        isVerified: userRole === "ADMIN", // Auto-verify if admin is uploading
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
  }
}

