import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function GET(req: Request,  { params }: { params: Promise<{ id: string }> }) 
{  const { id} = await params 
try {
    // Check if user is admin
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || (await decoded).payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId =id

    // Get user orders
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Failed to fetch user orders" }, { status: 500 })
  }
}

