import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/auth";
import { z } from "zod";

const addressSchema = z.object({
  contactName: z.string().min(2, "Contact name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional(),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().length(6, "ZIP code must be exactly 6 digits"),
  type: z.enum(["BILLING", "DISPATCH"]),
});

// Get user addresses
export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== "object" || !decoded.payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.payload.id as string;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      addresses: addresses.map(address => ({
        id: address.id,
        contactName: address.contactName,
        phone: address.phone,
        email: address.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        type: address.type,
        createdAt: address.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// Create new address
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== "object" || !decoded.payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.payload.id as string;

    const body = await req.json();
    
    // Validate request body
    const validationResult = addressSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const addressData = validationResult.data;

    // Create address
    const address = await prisma.address.create({
      data: {
        userId,
        contactName: addressData.contactName,
        phone: addressData.phone,
        email: addressData.email || null,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || null,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        type: addressData.type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address created successfully",
      address: {
        id: address.id,
        contactName: address.contactName,
        phone: address.phone,
        email: address.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        type: address.type,
        createdAt: address.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}