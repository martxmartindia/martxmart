import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    const territory = await prisma.territory.findFirst({
      where: {
        id,
        franchiseId: franchise.id,
      },
    });

    if (!territory) {
      return NextResponse.json(
        { error: "Territory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ territory });
  } catch (error) {
    console.error("Get territory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, city, state, zipCodes, population, businessPotential, isExclusive } = body;

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Check if territory exists and belongs to franchise
    const existingTerritory = await prisma.territory.findFirst({
      where: {
        id,
        franchiseId: franchise.id,
      },
    });

    if (!existingTerritory) {
      return NextResponse.json(
        { error: "Territory not found" },
        { status: 404 }
      );
    }

    // Check if another territory with same name exists (excluding current one)
    if (name !== existingTerritory.name) {
      const nameConflict = await prisma.territory.findFirst({
        where: {
          franchiseId: franchise.id,
          name: name,
          id: { not: id },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: "Territory with this name already exists" },
          { status: 400 }
        );
      }
    }

    const territory = await prisma.territory.update({
      where: { id: id },
      data: {
        name,
        city,
        state,
        zipCodes: zipCodes || [],
        population: population || null,
        businessPotential: businessPotential ? parseFloat(businessPotential) : null,
        isExclusive: isExclusive || false,
      },
    });

    return NextResponse.json({
      message: "Territory updated successfully",
      territory,
    });
  } catch (error) {
    console.error("Update territory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Check if territory exists and belongs to franchise
    const territory = await prisma.territory.findFirst({
      where: {
        id,
        franchiseId: franchise.id,
      },
    });

    if (!territory) {
      return NextResponse.json(
        { error: "Territory not found" },
        { status: 404 }
      );
    }

    await prisma.territory.delete({
      where: { id:id },
    });

    return NextResponse.json({
      message: "Territory deleted successfully",
    });
  } catch (error) {
    console.error("Delete territory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}