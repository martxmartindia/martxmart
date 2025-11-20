import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function POST(req: Request,  { params }: { params: Promise<{ id: string }> }) 
{  const { id} = await params 
  try {
    // Check if user is admin or the vendor
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-expect-error - JWT payload type is dynamic
    const userId = decoded.id
    // @ts-expect-error - JWT payload type is dynamic
    const userRole = decoded.role

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

