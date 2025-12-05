import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, address, gstNumber, panNumber, contactEmail } = body;

    // Update franchise
    const updatedFranchise = await prisma.franchise.updateMany({
      where: { ownerId: session.user.id },
      data: {
        name: name || undefined,
        businessAddress: address || undefined,
        gstNumber: gstNumber || undefined,
        panNumber: panNumber || undefined,
        contactEmail: contactEmail || undefined,
      },
    });

    if (updatedFranchise.count === 0) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Franchise settings updated successfully",
    });
  } catch (error) {
    console.error("Franchise settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}