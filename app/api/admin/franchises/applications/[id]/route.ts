import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch franchise application
    const application = await prisma.franchiseApplication.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error fetching franchise application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status, notes } = body

    // Validate status
    if (!status || !["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "INTERVIEW_SCHEDULED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update franchise application
    const updatedApplication = await prisma.franchiseApplication.update({
      where: { id },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
      },
    })

    // If approved, you might want to send an email notification
    // if (status === "APPROVED") {
    //   await sendApprovalEmail(updatedApplication.email);
    // }
    // If rejected, you might want to send a rejection email
    // if (status === "REJECTED") {
    //   await sendRejectionEmail(updatedApplication.email);
    // TODO: Implement email notifications for approval and rejection

    return NextResponse.json({ application: updatedApplication })
  } catch (error) {
    console.error("Error updating franchise application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

