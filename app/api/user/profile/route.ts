import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { requireCustomer, getUserWithDb } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    // Require authentication for customer
    const authResult = await requireCustomer(req);
    
    // If authentication failed, return the error response
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = await getUserWithDb(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}