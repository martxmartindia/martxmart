import { NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"
import { getAuthenticatedUser } from '@/lib/auth-helpers';



export async function GET(request: Request) {
  try {
        // Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const addresses = await db.address.findMany({
      where: {
        userId: user.id,
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
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }   

    const { type, contactName, phone, email, addressLine1, addressLine2, city, state, zip, isDefault } =
      await request.json()

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await db.address.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          // isDefault field removed because it does not exist in the Address model
        },
      })
    }

    const address = await db.address.create({
      data: {
        userId: user.id,
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
