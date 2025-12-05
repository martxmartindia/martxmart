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

    const promotions = await prisma.promotionRequest.findMany({
      where: { franchiseId: franchise.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate summary
    const totalRequests = promotions.length;
    const pendingRequests = promotions.filter(p => p.status === "PENDING").length;
    const approvedRequests = promotions.filter(p => p.status === "APPROVED").length;
    const completedRequests = promotions.filter(p => p.status === "COMPLETED").length;

    return NextResponse.json({
      promotions,
      summary: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        completedRequests,
      },
    });
  } catch (error) {
    console.error("Franchise promotions error:", error);
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
    const { title, description, type, materials, notes } = body;

    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    const promotion = await prisma.promotionRequest.create({
      data: {
        franchiseId: franchise.id,
        title,
        description,
        type,
        materials: materials || [],
        notes,
      },
    });

    return NextResponse.json({
      message: "Promotion request submitted successfully",
      promotion,
    });
  } catch (error) {
    console.error("Create promotion request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}