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
        { error: "Project slug is required" },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: {
        slug: slug,
      },
      include: {
        projectCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        machinery: {
          select: {
            id: true,
            name: true,
            cost: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Transform the response to match the expected interface
    const transformedProject = {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      longDescription: project.longDescription,
      scheme: project.scheme,
      estimatedCost: project.estimatedCost,
      timeline: project.timeline,
      requirements: project.requirements,
      landRequirement: project.landRequirement,
      powerRequirement: project.powerRequirement,
      manpower: project.manpower,
      rawMaterials: project.rawMaterials,
      marketPotential: project.marketPotential,
      profitMargin: project.profitMargin,
      breakEven: project.breakEven,
      subsidyDetails: project.subsidyDetails,
      documents: project.documents,
      projectReportCost: Number(project.projectReportCost),
      category: project.projectCategory,
      machinery: project.machinery,
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}