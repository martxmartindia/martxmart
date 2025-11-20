import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/utils/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)

    if (!decoded || typeof decoded !== "object" || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all authors with their details
    const authors = await prisma.author.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            isVerified: true,
            createdAt: true,
          },
        },
        blogs: {
          select: {
            id: true,
            views: true,
            likes: true,
            comments: true,
          },
        },
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    })

    // Transform data into CSV format
    const csvHeader = [
      "Name",
      "Email",
      "Phone",
      "Specialty",
      "Bio",
      "Profile Image",
      "Social Links",
      "Total Posts",
      "Total Views",
      "Total Likes",
      "Total Comments",
      "Status",
      "Registration Date",
    ].join(",")

    const csvRows = authors.map((author) => {
        const totalViews = author.blogs.reduce((sum, blog) => sum + (blog.views?.length ?? 0), 0)
        const totalLikes = author.blogs.reduce((sum, blog) => sum + (blog.likes?.length ?? 0), 0)
        const totalComments = author.blogs.reduce((sum, blog) => sum + (blog.comments?.length ?? 0), 0)
        
      return [
        author.user.name,
        author.user.email,
        author.user.phone || "",
        author.specialty || "",
        author.bio || "",
        author.profileImage || "",
        author.socialLinks ? JSON.stringify(author.socialLinks) : "",
        author._count.blogs,
        totalViews,
        totalLikes,
        totalComments,
        author.user.isVerified ? "Verified" : "Pending",
        new Date(author.user.createdAt).toLocaleDateString(),
      ]
        .map((field) => `"${field?.toString().replace(/"/g, '""')}"`) // Escape quotes and wrap fields
        .join(",")
    })

    const csv = [csvHeader, ...csvRows].join("\n")

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=authors-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Error exporting authors:", error)
    return NextResponse.json({ error: "Failed to export authors" }, { status: 500 })
  }
}