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

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    const territories = await prisma.territory.findMany({
      where: { franchiseId: franchise.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      territories,
      total: territories.length,
    });
  } catch (error) {
    console.error("Franchise territories error:", error);
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

    // Check if territory with same name already exists for this franchise
    const existingTerritory = await prisma.territory.findFirst({
      where: {
        franchiseId: franchise.id,
        name: name,
      },
    });

    if (existingTerritory) {
      return NextResponse.json(
        { error: "Territory with this name already exists" },
        { status: 400 }
      );
    }

    const territory = await prisma.territory.create({
      data: {
        franchiseId: franchise.id,
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
      message: "Territory created successfully",
      territory,
    });
  } catch (error) {
    console.error("Create territory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}