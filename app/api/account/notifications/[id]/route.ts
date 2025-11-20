import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function PATCH(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
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

    // Get notification
    const notification = await prisma.notification.findUnique({
      where: {
        id: id,
      },
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Check if notification belongs to user
    if (notification.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const data = await req.json()

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: {
        id:id,
      },
      data: {
        isRead: data.isRead,
      },
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
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

    // Get notification
    const notification = await prisma.notification.findUnique({
      where: {
        id: userId as string,
      },
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Check if notification belongs to user
    if (notification.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete notification
    await prisma.notification.delete({
      where: {
        id:userId as string,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}

