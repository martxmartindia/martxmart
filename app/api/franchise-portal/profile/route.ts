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

    // Get franchise with owner details
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
      include: {
        owner: {
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

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Format the response to match the frontend interface
    const franchiseData = {
      id: franchise.id,
      name: franchise.name,
      address: franchise.businessAddress || "",
      gstNumber: franchise.gstNumber || "",
      panNumber: franchise.panNumber || "",
      contactEmail: franchise.contactEmail || "",
      contactPhone: franchise.contactPhone || "",
      businessAddress: franchise.businessAddress || "",
      owner: {
        id: franchise.owner.id,
        name: franchise.owner.name,
        email: franchise.owner.email,
        phone: franchise.owner.phone || "",
        image: franchise.owner.image || null,
      },
    };

    return NextResponse.json({
      franchise: franchiseData,
    });
  } catch (error) {
    console.error("Franchise profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}