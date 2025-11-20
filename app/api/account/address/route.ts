import { verifyJWT } from "@/utils/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await verifyJWT(token);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: user.payload.id as string },
    });
    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { message: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyJWT(token);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, contactName, phone, email, addressLine1, addressLine2, city, state, zip } = await req.json();
    
    if (!type || !contactName || !phone || !addressLine1 || !city || !state || !zip) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const address = await prisma.address.create({
      data: {
        type,
        contactName,
        phone,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        userId: user.payload.id as string,
      },
    });
    return NextResponse.json(
      { success: true, message: "Address added successfully", address },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { message: "Failed to add address" },
      { status: 500 }
    );
  }
}