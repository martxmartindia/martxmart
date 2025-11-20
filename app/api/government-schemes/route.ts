import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET() {
  try {
    const schemes = await prisma.governmentScheme.findMany()
    return NextResponse.json(schemes)
  } catch (error) {
    console.error("Error fetching government schemes:", error)
    return NextResponse.json({ error: "Failed to fetch government schemes" }, { status: 500 })
  }
}
