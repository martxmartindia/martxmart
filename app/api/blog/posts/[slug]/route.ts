import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT as verifyJwtToken } from "@/utils/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    // Increment view count
    await prisma.blog.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    // Get the post with related data
    const post = await prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            // images: true,
          },
        },
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                // image: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    // image: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get related posts from the same category
    const relatedPosts = await prisma.blog.findMany({
      where: {
        categoryId: post.categoryId,
        publishedAt: { not: null },
        slug: { not: slug },
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token);

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.payload.id;
    const data = await request.json();

    // Get the post to check ownership
    const post = await prisma.blog.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
    });

    if (!user || (user.role !== "ADMIN" && post.authorId !== userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // Update the post
    const updatedPost = await prisma.blog.update({
      where: { slug },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        publishedAt: data.published,
        tags: data.tags,
        categoryId: data.categoryId,
        // If slug is being changed, update it
        ...(data.slug && data.slug !== slug ? { slug: data.slug } : {}),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE( request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    
  const slug = (await params).slug;
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token);

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.payload.id;
    // Get the post to check ownership
    const post = await prisma.blog.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }
    // Delete the post (comments will be cascade deleted)
    await prisma.blog.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
