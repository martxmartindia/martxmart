import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT as verifyJwtToken } from "@/utils/auth"

export async function POST(req: Request) {
  try {
    // Check if user is admin
    const token = (await cookies()).get("token")?.value    

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwtToken(token)

    if (!decoded || typeof decoded !== "object" || (await decoded).payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
      },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

