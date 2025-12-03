import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"

export async function GET(req: Request,  { params }: { params: Promise<{ id: string }> }) { 
   const { id} = await params 
  try {
   // Use NextAuth authentication instead of custom JWT
     const authError = await requireAuth();
     if (authError) return authError;
     
     const user = await getAuthenticatedUser();
     if (!user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    if (quotation.userId !== user.id && user.role !== "ADMIN") {
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
     // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

