import {  NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" ||(await decoded).payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quotations = await prisma.quotation.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(quotations)
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

