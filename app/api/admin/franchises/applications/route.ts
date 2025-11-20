import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET(req: Request) {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    // Build query
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Fetch franchise applications
    const applications = await prisma.franchiseApplication.findMany({
      where,
      orderBy: {
        submittedAt: "desc",
      },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching franchise applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

