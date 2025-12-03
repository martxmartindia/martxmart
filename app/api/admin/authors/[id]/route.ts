import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = (await params).id
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get author
    const author = await prisma.author.findUnique({
      where: { userId: userId  },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    })

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    // Transform the data to include post count
    const authorWithPostCount = {
      ...author,
      postCount: author._count.blogs,
      _count: undefined,
    }

    return NextResponse.json({ author: authorWithPostCount })
  } catch (error) {
    console.error("Error fetching author:", error)
    return NextResponse.json({ error: "Failed to fetch author" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    // Get request body
    const data = await req.json()

    // Get author to check if it exists
    const existingAuthor = await prisma.author.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!existingAuthor) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    // Update author
    const author = await prisma.author.update({
      where: { id },
      data: {
        bio: data.bio,
        isActive: data.isActive !== undefined ? data.isActive : existingAuthor.isActive,
      },
    })

    // Update user if name or email is provided
    if (data.name || data.email || data.password) {
      const userData: any = {}

      if (data.name) {
        userData.name = data.name
      }

      if (data.email) {
        // Check if email already exists
        if (data.email !== existingAuthor.user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
          })

          if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 })
          }

          userData.email = data.email
        }
      }

      if (data.password) {
        userData.password = await bcrypt.hash(data.password, 10)
      }

      await prisma.user.update({
        where: { id: existingAuthor.userId },
        data: userData,
      })
    }

    return NextResponse.json({ author })
  } catch (error) {
    console.error("Error updating author:", error)
    return NextResponse.json({ error: "Failed to update author" }, { status: 500 })
  }
}

