import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"
export async function POST(request: Request) {
  try {
  // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id

    const data = await request.json()
    const { projectId, paymentMethod, applicationData } = data

    // Get the project to check its cost
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Create a new project report
    const projectReport = await prisma.projectReport.create({
      data: {
        projectId,
        userId: userId as string,
        paymentAmount: project.projectReportCost,
        paymentMethod,
        applicationData,
        status: "Pending",
        paymentStatus: "Pending",
      },
    })

    return NextResponse.json(projectReport)
  } catch (error) {
    console.error("Error creating project report:", error)
    return NextResponse.json({ error: "Failed to create project report" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
  // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id
    
    // Get all project reports for the user
    const projectReports = await prisma.projectReport.findMany({
      where: {
        userId: userId as string,
      },
      include: {
        Project: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform the response to match frontend expectations
    const transformedReports = projectReports.map(report => ({
      id: report.id,
      projectId: report.projectId,
      status: report.status,
      paymentStatus: report.paymentStatus,
      paymentAmount: Number(report.paymentAmount),
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      reportUrl: report.reportUrl,
      project: {
        name: report.Project.name,
        slug: report.Project.slug,
      },
    }))

    return NextResponse.json(transformedReports)
  } catch (error) {
    console.error("Error fetching project reports:", error)
    return NextResponse.json({ error: "Failed to fetch project reports" }, { status: 500 })
  }
}
