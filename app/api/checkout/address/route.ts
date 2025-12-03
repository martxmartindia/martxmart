import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"


export async function POST(req: Request) {
  try {
    const auth=await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
   
    const data = await req.json()

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        userId: userId as string,
        contactName: data.fullName,
        type: data.type  || "BILLING",
        phone: data.phone,
        email: data.email,
        addressLine1: data.address,
        city: data.city,
        state: data.state,
        zip: data.pincode,
      },
    })

    return NextResponse.json({message:"Address add successful", success: true, address }, { status: 201 })
  } catch (error) {
    console.error("Error saving address:", error)
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 })
}
}

export async function GET(req: Request) {
  try {
    const auth=await requireAuth();
    if (auth instanceof NextResponse) return  auth;
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Fetch user addresses
    const addresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
    })

    return NextResponse.json({ addresses }, { status: 200 })
  }
  catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}