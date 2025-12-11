import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id

    // Get vendor profile to check for notification settings
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId },
      select: {
        verificationData: true
      }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Extract notification settings from verificationData JSON field
    const notificationData = vendorProfile.verificationData as any
    const notificationSettings = notificationData?.notificationSettings || {
      emailNotifications: {
        newOrders: true,
        orderUpdates: true,
        lowStock: true,
        payouts: true,
        systemUpdates: false,
        marketing: false,
      },
      smsNotifications: {
        newOrders: true,
        orderUpdates: false,
        lowStock: true,
        payouts: true,
        systemUpdates: false,
      },
      pushNotifications: {
        newOrders: true,
        orderUpdates: true,
        lowStock: true,
        payouts: true,
        systemUpdates: true,
      }
    }

    return NextResponse.json(notificationSettings)

  } catch (error) {
    console.error("Error fetching notification settings:", error)
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id
    const data = await req.json()

    // Get current vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId },
      select: {
        verificationData: true
      }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Extract current verification data
    const currentData = vendorProfile.verificationData as any || {}
    
    // Update notification settings in the JSON field
    const updatedNotificationSettings = {
      emailNotifications: {
        newOrders: data.emailNotifications?.newOrders ?? true,
        orderUpdates: data.emailNotifications?.orderUpdates ?? true,
        lowStock: data.emailNotifications?.lowStock ?? true,
        payouts: data.emailNotifications?.payouts ?? true,
        systemUpdates: data.emailNotifications?.systemUpdates ?? false,
        marketing: data.emailNotifications?.marketing ?? false,
      },
      smsNotifications: {
        newOrders: data.smsNotifications?.newOrders ?? true,
        orderUpdates: data.smsNotifications?.orderUpdates ?? false,
        lowStock: data.smsNotifications?.lowStock ?? true,
        payouts: data.smsNotifications?.payouts ?? true,
        systemUpdates: data.smsNotifications?.systemUpdates ?? false,
      },
      pushNotifications: {
        newOrders: data.pushNotifications?.newOrders ?? true,
        orderUpdates: data.pushNotifications?.orderUpdates ?? true,
        lowStock: data.pushNotifications?.lowStock ?? true,
        payouts: data.pushNotifications?.payouts ?? true,
        systemUpdates: data.pushNotifications?.systemUpdates ?? true,
      }
    }

    // Save to database
    await prisma.vendorProfile.update({
      where: { userId: vendorId },
      data: {
        verificationData: {
          ...currentData,
          notificationSettings: updatedNotificationSettings
        },
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: "Notification settings updated successfully",
      notificationSettings: updatedNotificationSettings
    })

  } catch (error) {
    console.error("Error updating notification settings:", error)
    return NextResponse.json({ error: "Failed to update notification settings" }, { status: 500 })
  }
}