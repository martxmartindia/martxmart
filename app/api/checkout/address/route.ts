import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

export async function POST(req: Request) {
  try {
    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)
    if (!decoded.payload || typeof decoded.payload.id !== 'string') {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 })
    }
    const userId = decoded.payload.id
    const data = await req.json()

    // if (!data.type || !['BILLING', 'DISPATCH'].includes(data.type)) {
    //   return NextResponse.json({ error: "Invalid address type. Must be either 'BILLING' or 'DISPATCH'" }, { status: 400 })
    // }

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
    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)
    if (!decoded.payload || typeof decoded.payload.id!=='string') {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 })
    }
    const userId = decoded.payload.id

    // Fetch user addresses
    const addresses = await prisma.address.findMany({
      where: {
        userId: userId as string,
      },
    })

    return NextResponse.json({ addresses }, { status: 200 })
  }
  catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}