import { NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const projectReport = await prisma.projectReport.findUnique({
      where: {
        id,
      },
      include: {
        Project: {
          include: {
            projectCategory: true,
            machinery: true,
          },
        },
      },
    })

    if (!projectReport) {
      return NextResponse.json({ error: "Project report not found" }, { status: 404 })
    }

    // Transform the response to match frontend expectations
    const response = {
      ...projectReport,
      project: projectReport.Project,
      Project: undefined
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching project report:", error)
    return NextResponse.json({ error: "Failed to fetch project report" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
  const id = (await params).id;
    const data = await request.json()
    const { status, paymentStatus, reportUrl } = data

    const projectReport = await prisma.projectReport.update({
      where: {
        id,
      },
      data: {
        status,
        paymentStatus,
        reportUrl,
      },
    })

    return NextResponse.json(projectReport)
  } catch (error) {
    console.error("Error updating project report:", error)
    return NextResponse.json({ error: "Failed to update project report" }, { status: 500 })
  }
}
