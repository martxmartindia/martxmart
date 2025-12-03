import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'AUTHOR')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
        authorId: session.user.id,
        isDeleted: false,
      },
    });

    if (!blog) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("[BLOG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req:  Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, metaTitle, metaDescription, tags, featuredImage, status } = body;

    if (!title || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id:blogId,
        authorId: session.user.id,
        isDeleted: false,
      },
    });

    if (!blog) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id:blogId },
      data: {
        title,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        tags,
        featuredImage,
        status,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("[BLOG_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req:  Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
        authorId: session.user.id,
        isDeleted: false,
      },
    });

    if (!blog) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    await prisma.blog.update({
      where: { id: blogId },
      data: { isDeleted: true },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BLOG_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}