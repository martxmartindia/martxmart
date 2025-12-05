import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get franchise
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Get vendors associated with this franchise
    const vendors = await prisma.vendorProfile.findMany({
      where: {
        franchiseId: franchise.id,
        isVerified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format for frontend
    const formattedVendors = vendors.map(vendor => ({
      id: vendor.id,
      businessName: vendor.businessName,
      businessType: vendor.businessType,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      pincode: vendor.pincode,
      gstNumber: vendor.gstNumber,
      panNumber: vendor.panNumber,
      status: vendor.isVerified ? "APPROVED" : "PENDING",
      createdAt: vendor.createdAt.toISOString(),
      user: vendor.user,
    }));

    return NextResponse.json({
      vendors: formattedVendors,
    });
  } catch (error) {
    console.error("Franchise vendors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      businessType,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
      userId,
    } = body;

    // Get franchise
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Create vendor profile
    const vendor = await prisma.vendorProfile.create({
      data: {
        businessName,
        businessType,
        address,
        city,
        state,
        pincode,
        gstNumber,
        panNumber,
        userId,
        franchiseId: franchise.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        businessName: vendor.businessName,
        businessType: vendor.businessType,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        pincode: vendor.pincode,
        gstNumber: vendor.gstNumber,
        panNumber: vendor.panNumber,
        status: "PENDING",
        createdAt: vendor.createdAt.toISOString(),
        user: vendor.user,
      },
    });
  } catch (error) {
    console.error("Create vendor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}