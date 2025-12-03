import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from '@/lib/auth-helpers';
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

// Update address
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;
    const { id: addressId } = await params;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

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

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
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
      message: "Address updated successfully",
      address: {
        id: updatedAddress.id,
        contactName: updatedAddress.contactName,
        phone: updatedAddress.phone,
        email: updatedAddress.email,
        addressLine1: updatedAddress.addressLine1,
        addressLine2: updatedAddress.addressLine2,
        city: updatedAddress.city,
        state: updatedAddress.state,
        zip: updatedAddress.zip,
        type: updatedAddress.type,
        createdAt: updatedAddress.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// Delete address
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;
    const { id: addressId } = await params;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // Check if address is being used in any orders
    const ordersUsingAddress = await prisma.order.findFirst({
      where: {
        OR: [
          { shippingAddressId: addressId },
          { billingAddressId: addressId }
        ]
      }
    });

    if (ordersUsingAddress) {
      return NextResponse.json(
        { error: "Cannot delete address that is used in orders" },
        { status: 400 }
      );
    }

    // Delete address
    await prisma.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}

// Get single address
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const { id: addressId } = await params;

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}