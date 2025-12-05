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

    // Get staff for this franchise
    const staff = await prisma.franchiseStaff.findMany({
      where: { franchiseId: franchise.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      staff: staff.map((staffMember) => ({
        id: staffMember.id,
        role: staffMember.role,
        permissions: staffMember.permissions,
        createdAt: staffMember.createdAt,
        updatedAt: staffMember.updatedAt,
        user: staffMember.user,
      })),
    });
  } catch (error) {
    console.error("Franchise staff error:", error);
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
    const { userId, role, permissions } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
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

    // Check if user exists and is not already staff
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already staff
    const existingStaff = await prisma.franchiseStaff.findFirst({
      where: {
        franchiseId: franchise.id,
        userId: userId,
      },
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: "User is already staff member" },
        { status: 400 }
      );
    }

    // Create staff member
    const staffMember = await prisma.franchiseStaff.create({
      data: {
        franchiseId: franchise.id,
        userId,
        role,
        permissions: permissions || {},
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Staff member added successfully",
      staff: staffMember,
    });
  } catch (error) {
    console.error("Add staff member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { staffId, role, permissions } = body;

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
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

    // Update staff member
    const updatedStaff = await prisma.franchiseStaff.updateMany({
      where: {
        id: staffId,
        franchiseId: franchise.id,
      },
      data: {
        ...(role && { role }),
        ...(permissions && { permissions }),
      },
    });

    if (updatedStaff.count === 0) {
      return NextResponse.json(
        { error: "Staff member not found or not accessible" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Staff member updated successfully",
    });
  } catch (error) {
    console.error("Update staff member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
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

    // Delete staff member
    const deletedStaff = await prisma.franchiseStaff.deleteMany({
      where: {
        id: staffId,
        franchiseId: franchise.id,
      },
    });

    if (deletedStaff.count === 0) {
      return NextResponse.json(
        { error: "Staff member not found or not accessible" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Staff member removed successfully",
    });
  } catch (error) {
    console.error("Remove staff member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}