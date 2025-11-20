import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Create default blog categories if they don't exist
    const defaultCategories = [
      { name: "Technology", slug: "technology" },
      { name: "Business", slug: "business" },
      { name: "Agriculture", slug: "agriculture" },
      { name: "Food Processing", slug: "food-processing" },
      { name: "Manufacturing", slug: "manufacturing" },
      { name: "News", slug: "news" },
      { name: "Tutorials", slug: "tutorials" },
      { name: "Industry Updates", slug: "industry-updates" },
    ]

    const createdCategories = []

    for (const category of defaultCategories) {
      const existingCategory = await prisma.blogCategory.findUnique({
        where: { slug: category.slug },
      })

      if (!existingCategory) {
        const newCategory = await prisma.blogCategory.create({
          data: category,
        })
        createdCategories.push(newCategory)
      }
    }

    return NextResponse.json({
      message: "Blog categories seeded successfully",
      created: createdCategories.length,
      categories: createdCategories,
    })
  } catch (error) {
    console.error("Error seeding blog categories:", error)
    return NextResponse.json({ error: "Failed to seed blog categories" }, { status: 500 })
  }
}