import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// URL validation helper
function isValidUrl(url: string | null): boolean {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export async function PUT(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const UserId = (await params).id;
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if author exists
    const authorExists = await prisma.author.findUnique({
      where: { id: UserId as string },
    })

    if (!authorExists) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    const data = await request.json()

    // Validate social media links
    const socialLinks = {
      twitter: data.twitter || null,
      linkedin: data.linkedin || null,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      website: data.website || null,
    }

    // Validate URLs
    const invalidUrls = Object.entries(socialLinks)
      .filter(([_, url]) => url && !isValidUrl(url))
      .map(([key]) => key)

    if (invalidUrls.length > 0) {
      return NextResponse.json({
        error: "Invalid URLs provided",
        invalidFields: invalidUrls
      }, { status: 400 })
    }

    // Validate other fields length
    const maxLength = 500
    const textFields = {
      location: data.location,
      education: data.education,
      experience: data.experience,
      achievements: data.achievements
    }

    const invalidFields = Object.entries(textFields)
      .filter(([_, value]) => value && value.length > maxLength)
      .map(([key]) => key)

    if (invalidFields.length > 0) {
      return NextResponse.json({
        error: `Text fields must not exceed ${maxLength} characters`,
        invalidFields
      }, { status: 400 })
    }

    // Update author profile
    const author = await prisma.author.update({
      where: { id: UserId as string  },
      data: {
        socialLinks,
        location: data.location || null,
        education: data.education || null,
        experience: data.experience || null,
        achievements: data.achievements || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        specialty: true,
        socialLinks: true,
        location: true,
        education: true,
        experience: true,
        achievements: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            blogs: true,
            comments: true,
            likes: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Profile information updated successfully",
      author,
    })
  } catch (error) {
    console.error("Error updating profile information:", error)
    return NextResponse.json({ error: "Failed to update profile information" }, { status: 500 })
  }
}

export async function GET( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
try {
  const UserId = (await params).id;
    const author = await prisma.author.findUnique({
      where: { id: UserId as string },
      select: {
        socialLinks: true,
        location: true,
      },
    })

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error("Error fetching profile information:", error)
    return NextResponse.json({ error: "Failed to fetch profile information" }, { status: 500 })
  }
}