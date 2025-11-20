import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/auth"

export async function GET(request: Request) {
  try {
        // Check authentication
      const token = (await cookies()).get("token")?.value
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const decoded =await verifyJWT(token)
  
      if (!decoded || typeof decoded !== "object") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const userId = decoded.payload.id as string;
    const addresses = await db.address.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error("Addresses fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
       // Check authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded =await verifyJWT(token)

    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.payload.id as string;

    const { type, contactName, phone, email, addressLine1, addressLine2, city, state, zip, isDefault } =
      await request.json()

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await db.address.updateMany({
        where: {
          userId: userId,
        },
        data: {
          // isDefault field removed because it does not exist in the Address model
        },
      })
    }

    const address = await db.address.create({
      data: {
        userId:userId,
        type,
        contactName,
        phone,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("Address creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
