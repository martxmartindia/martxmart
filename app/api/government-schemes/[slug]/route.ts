import { NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const scheme = await prisma.governmentScheme.findUnique({
      where: {
        slug: slug,
      },
    })

    if (!scheme) {
      return NextResponse.json({ error: "Government scheme not found" }, { status: 404 })
    }

    return NextResponse.json(scheme)
  } catch (error) {
    console.error("Error fetching government scheme:", error)
    return NextResponse.json({ error: "Failed to fetch government scheme" }, { status: 500 })
  }
}
