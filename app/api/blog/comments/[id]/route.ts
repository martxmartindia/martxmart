import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await verifyJWT(token)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.payload.id as string
    const data = await request.json()

    // Get the comment to check ownership
    const comment = await prisma.blogComment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user owns the comment or is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || (user.role !== "ADMIN" && comment.userId !== userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the comment
    const updatedComment = await prisma.blogComment.update({
      where: { id },
      data: {
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await verifyJWT(token)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.payload.id as string

    // Get the comment to check ownership
    const comment = await prisma.blogComment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user owns the comment or is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || (user.role !== "ADMIN" && comment.userId !== userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the comment (replies will be cascade deleted)
    await prisma.blogComment.delete({
      where: { id },
    })

    // Update comment count on the blog post
    await prisma.blog.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}