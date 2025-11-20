import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      )
    }

    const report = await prisma.projectReport.findUnique({
      where: {
        id: slug,
      },
      include: {
        Project: {
          include: {
            projectCategory: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: "Project report not found" },
        { status: 404 }
      )
    }

    // Get payment details if exists
    const payment = report.paymentId ? await prisma.payment.findUnique({
      where: { id: report.paymentId },
      select: {
        id: true,
        method: true,
        transactionId: true,
        razorpayPaymentId: true,
        createdAt: true,
      },
    }) : null

    const transformedReport = {
      id: report.id,
      projectId: report.projectId,
      status: report.status,
      paymentStatus: report.paymentStatus,
      paymentAmount: Number(report.paymentAmount),
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      reportUrl: report.reportUrl,
      deliveryDate: null,
      notes: null,
      project: {
        name: report.Project.name,
        slug: report.Project.slug,
        description: report.Project.description,
        category: {
          name: report.Project.projectCategory.name,
        },
      },
      user: report.user,
      address: report.applicationData && typeof report.applicationData === 'object' && report.applicationData !== null ? {
        addressLine1: (report.applicationData as any).residenceAddress || "N/A",
        addressLine2: null,
        city: (report.applicationData as any).residenceDistrict || "N/A",
        state: (report.applicationData as any).residenceState || "N/A",
        zip: (report.applicationData as any).residencePincode || "N/A",
      } : null,
      payment: payment ? {
        id: payment.id,
        method: payment.method || "razorpay",
        transactionId: payment.transactionId,
        razorpayPaymentId: payment.razorpayPaymentId,
        createdAt: payment.createdAt.toISOString(),
      } : null,
    }

    return NextResponse.json(transformedReport)
  } catch (error) {
    console.error("Error fetching project report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}