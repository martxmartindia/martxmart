import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
      try {
      const userId = (await params).id;
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for time range
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "month" // week, month, year

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (timeframe) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // Fetch author's blogs and related statistics
    const author = await prisma.author.findUnique({
      where: { id: userId as string },
      include: {
        blogs: {
          where: {
            publishedAt: {
              gte: startDate,
              lte: now,
            },
          },
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            viewCount: true,
            likeCount: true,
            commentCount: true
          }
        },
        _count: {
          select: {
            blogs: true,
            comments: true
          },
        },
      },
    })

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    // Calculate statistics
    const totalPosts = author._count.blogs
    const recentPosts = author.blogs.length
    const totalViews = author.blogs.reduce((sum, blog) => sum + blog.viewCount, 0)
    const totalLikes = author.blogs.reduce((sum, blog) => sum + blog.likeCount, 0)
    const totalComments = author.blogs.reduce((sum, blog) => sum + blog.commentCount, 0)

    // Calculate engagement rate
    const engagementRate =
      totalPosts > 0
        ? ((totalLikes + totalComments) / (totalViews || 1)) * 100
        : 0

    // Group posts by status
    const postsByStatus = author.blogs.reduce(
      (acc, blog) => {
        acc[blog.status] = (acc[blog.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Calculate post frequency
    const postFrequency = recentPosts / (timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365)

    // Prepare performance metrics
    const performanceMetrics = {
      totalPosts,
      recentPosts,
      totalViews,
      totalLikes,
      totalComments,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postFrequency: parseFloat(postFrequency.toFixed(2)),
      postsByStatus,
      timeframe,
    }

    // Prepare trend data
    const trendData = author.blogs
    .sort((a, b) => new Date(a.publishedAt!).getTime() - new Date(b.publishedAt!).getTime())
    .map((blog) => ({
      date: blog.publishedAt,
      views: blog.viewCount,
      likes: blog.likeCount,
      comments: blog.commentCount,
    }));
  
    return NextResponse.json({
      performanceMetrics,
      trendData,
    })
  } catch (error) {
    console.error("Error fetching author statistics:", error)
    return NextResponse.json({ error: "Failed to fetch author statistics" }, { status: 500 })
  }
}