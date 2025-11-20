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
        { error: "Category slug is required" },
        { status: 400 }
      )
    }

    const category = await prisma.projectCategory.findUnique({
      where: {
        slug: slug,
      },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            scheme: true,
            estimatedCost: true,
            timeline: true,
            projectReportCost: true,
            machinery: {
              select: {
                name: true,
                cost: true,
              },
            },
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Transform the response to match the expected interface
    const transformedCategory = {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      projects: category.projects.map(project => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        scheme: project.scheme,
        estimatedCost: project.estimatedCost,
        timeline: project.timeline,
        projectReportCost: Number(project.projectReportCost),
        machinery: project.machinery,
      })),
    }

    return NextResponse.json(transformedCategory)
  } catch (error) {
    console.error("Error fetching project category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}