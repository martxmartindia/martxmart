// app/api/kyc/verify/hsn/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // const where = search
    //   ? {
    //       OR: [
    //         { hsnCode: { contains: search, mode: "insensitive" } },
    //         { hsnName: { contains: search, mode: "insensitive" } },
    //       ],
    //     }
    //   : {};
      // Explicitly type the where clause
    const where: Prisma.hsnDetailWhereInput = search
    ? {
        OR: [
          { hsnCode: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { hsnName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

    const [hsnCodes, total] = await Promise.all([
      prisma.hsnDetail.findMany({
        where,
        orderBy: { hsnCode: "asc" },
        take: limit,
        skip,
      }),
      prisma.hsnDetail.count({ where }),
    ]);

    return NextResponse.json({
      hsnCodes,
      total,
      page,
      pages: Math.ceil(total / limit),
      message: "HSN codes fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching HSN codes:", error);
    return NextResponse.json(
      { message: "Failed to fetch HSN codes" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { hsnCode, hsnName } = await request.json();
    if (!hsnCode || !hsnName) {
      return NextResponse.json(
        { message: "HSN Code and Name are required" },
        { status: 400 },
      );
    }

    const existingHsn = await prisma.hsnDetail.findFirst({ where: { hsnCode } });
    if (existingHsn) {
      return NextResponse.json(
        { message: "HSN Code already exists" },
        { status: 409 },
      );
    }

    const hsn = await prisma.hsnDetail.create({
      data: { hsnCode, hsnName },
    });

    return NextResponse.json(
      { message: "HSN Code Created Successfully", hsn },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating HSN code:", error);
    return NextResponse.json(
      { message: "Failed to create HSN code", error },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "HSN ID is required" },
        { status: 400 },
      );
    }

    const hsn = await prisma.hsnDetail.delete({ where: { id } });
    return NextResponse.json(
      { message: "HSN Code Deleted Successfully", hsn },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting HSN code:", error);
    return NextResponse.json(
      { message: "Failed to delete HSN code", error },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, hsnCode, hsnName } = await request.json();
    if (!id || !hsnCode || !hsnName) {
      return NextResponse.json(
        { message: "HSN ID, Code and Name are required" },
        { status: 400 },
      );
    }

    const existingHsn = await prisma.hsnDetail.findFirst({
      where: { hsnCode, NOT: { id } },
    });
    if (existingHsn) {
      return NextResponse.json(
        { message: "HSN Code already exists" },
        { status: 409 },
      );
    }

    const hsn = await prisma.hsnDetail.update({
      where: { id },
      data: { hsnCode, hsnName },
    });

    return NextResponse.json(
      { message: "HSN Code Updated Successfully", hsn },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating HSN code:", error);
    return NextResponse.json(
      { message: "Failed to update HSN code", error },
      { status: 500 },
    );
  }
}