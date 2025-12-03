import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
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

