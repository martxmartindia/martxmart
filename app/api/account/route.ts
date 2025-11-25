import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const userRole = user.role;

    // Define base select object for all roles
    const baseSelect = {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      addresses: true,
      orders: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true
                }
              }
            }
          },
          payment: true
        }
      },
      wishlist: userRole === 'CUSTOMER' ? true : false
    };

    // Add vendor-specific fields for vendor role
    const selectObject = userRole === 'VENDOR' ? {
      ...baseSelect,
      vendorProfile: {
        include: {
          documents: true,
          bankDetails: true
        }
      }
    } : baseSelect;

    const userProfile = await prisma.user.findUnique({
      where: { 
        id: userId as string,
        isDeleted: false
      },
      select: selectObject
    });

    if (!userProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Account found",
      user: userProfile
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id as string },
      data: {
        name: name,
        email: email,
        phone: phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true
      }
    });

    return NextResponse.json({
      message: "Account updated successfully",
      user: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reason } = body;

    await prisma.user.update({
      where: { id: user.id as string  },
      data: {
        isDeleted: true,
        deletionRequestedAt: new Date(),
        deletionReason: reason
      }
    });

    return NextResponse.json({
      message: "Account deletion requested successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error requesting account deletion:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}