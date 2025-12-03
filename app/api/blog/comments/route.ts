import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
   const result = await requireAuth();
    if (result instanceof NextResponse) return result;

    const decoded = await getAuthenticatedUser();
    if (!decoded || decoded.role !== "AUTHOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json()

    // Validate required fields
    if (!data.content || !data.postId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the blog post exists
    const post = await prisma.blog.findUnique({
      where: { id: data.postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Create the comment
    const comment = await prisma.blogComment.create({
      data: {
        content: data.content,
        postId: data.postId,
        userId: decoded.id,
        parentId: data.parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    // Update comment count on the blog post
    await prisma.blog.update({
      where: { id: data.postId },
      data: { commentCount: { increment: 1 } },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const comments = await prisma.blogComment.findMany({
      where: {
        postId: postId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}