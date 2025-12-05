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

    // Get franchise settings
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
      include: {
        Territory: true,
        FranchiseDocument: true,
      },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      franchise: {
        id: franchise.id,
        name: franchise.name,
        businessAddress: franchise.businessAddress,
        district: franchise.district,
        state: franchise.state,
        contactEmail: franchise.contactEmail,
        contactPhone: franchise.contactPhone,
        gstNumber: franchise.gstNumber,
        panNumber: franchise.panNumber,
        bankAccountNumber: franchise.bankAccountNumber,
        bankIfscCode: franchise.bankIfscCode,
        bankName: franchise.bankName,
        investmentSlab: franchise.investmentSlab,
        commissionRate: franchise.commissionRate,
        status: franchise.status,
        contractStartDate: franchise.contractStartDate,
        contractEndDate: franchise.contractEndDate,
        isActive: franchise.isActive,
        createdAt: franchise.createdAt,
        updatedAt: franchise.updatedAt,
        razorpayContactId: franchise.razorpayContactId,
        razorpayFundAccountId: franchise.razorpayFundAccountId,
        ownerId: franchise.ownerId,
        territories: franchise.Territory || [],
        documents: franchise.FranchiseDocument || [],
      },
    });
  } catch (error) {
    console.error("Franchise settings error:", error);
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

    // Update franchise settings
    const updatedFranchise = await prisma.franchise.update({
      where: { id: franchise.id },
      data: {
        name: body.name,
        businessAddress: body.businessAddress,
        district: body.district,
        state: body.state,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        bankAccountNumber: body.bankAccountNumber,
        bankIfscCode: body.bankIfscCode,
        bankName: body.bankName,
      },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      franchise: updatedFranchise,
    });
  } catch (error) {
    console.error("Update franchise settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}