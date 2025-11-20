import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id

    // Get request body
    const data = await req.json()

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId as string},
      data: {
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

