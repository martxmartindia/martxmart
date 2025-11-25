import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"

export async function GET(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } =await params;
    if (!id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })    
    }
    
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id

    // Get address
    const address = await prisma.address.findUnique({
      where: { id: id },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Check if address belongs to user
    if (address.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error fetching address:", error)
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 })
  }
}

export async function PUT(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } =await params;
    if (!id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })  
    }
    
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id

    // Get address
    const address = await prisma.address.findUnique({
      where: { id: id },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Check if address belongs to user
    if (address.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get request body
    const data = await req.json()

    // Validate required fields
    if (!data.contactName || !data.phone || !data.addressLine1 || !data.city || !data.state || !data.zip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }


    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: {
        type: data.type,
        contactName: data.contactName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        placeOfSupply: data.placeOfSupply,
      },
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } =await params;
  if (!id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })  
  }
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id

    // Get address
    const address = await prisma.address.findUnique({
      where: { id: id },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Check if address belongs to user
    if (address.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete address
    await prisma.address.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}

