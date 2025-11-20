import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { type: "SHOP" },
      include: {
        _count: {
          select: {
            shopping: {
              where: {
                isDeleted: false,
                isAvailable: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
