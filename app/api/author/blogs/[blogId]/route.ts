import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";

export async function GET(req: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const verified = await verifyJWT(token);
    if (!verified || verified.payload.role !== 'ADMIN' && verified.payload.role !=='AUTHOR') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
        authorId: verified.payload.sub,
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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const verified = await verifyJWT(token);
    if (!verified || verified.payload.role !== 'ADMIN') {
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
        authorId: verified.payload.sub,
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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const verified = await verifyJWT(token);
    if (!verified || verified.payload.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
        authorId: verified.payload.id as string,
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