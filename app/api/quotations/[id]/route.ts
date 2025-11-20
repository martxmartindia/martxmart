import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

export async function GET(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
   const { id} = await params 
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = await verifyJWT(token)
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: id },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            addresses: true,
          },
        },
      
      },
    })

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }

    // Check if the user is authorized to view this quotation
    if (quotation.userId !== decodedToken.payload.id && decodedToken.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error("Error fetching quotation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
  const { id} = await params 
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
    }

    const decodedToken = await verifyJWT(token)

    if (!decodedToken || !decodedToken.payload.id || decodedToken.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    const quotation = await prisma.quotation.update({
      where: { id: id },
      data: { status },
    })

    return NextResponse.json(quotation)
  } catch (error) {
    console.error("Error updating quotation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
  const { id} = await params 
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
    }

    const decodedToken = await verifyJWT(token)

    if (!decodedToken || !decodedToken.payload.id || decodedToken.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the quotation items first
    await prisma.quotationItem.deleteMany({
      where: { quotationId:id },
    })

    // Then delete the quotation
    await prisma.quotation.delete({
      where: { id:id },
    })

    return NextResponse.json({ message: "Quotation deleted successfully" })
  } catch (error) {
    console.error("Error deleting quotation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

