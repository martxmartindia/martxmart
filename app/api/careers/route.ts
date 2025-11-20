import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const whereClause: any = {
      isDeleted: false,
      status: "ACTIVE",
    };

    if (department && department !== "all") {
      whereClause.department = department;
    }

    if (location && location !== "all") {
      whereClause.location = location;
    }

    if (type && type !== "all") {
      whereClause.type = type;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const careers = await prisma.career.findMany({
      where: whereClause,
      orderBy: { postedDate: "desc" },
    });

    return NextResponse.json(careers);
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { error: "Failed to fetch careers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const career = await prisma.career.create({
      data: {
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type,
        experience: body.experience,
        description: body.description,
        responsibilities: body.responsibilities,
        requirements: body.requirements,
        benefits: body.benefits,
        salary: body.salary,
      },
    });

    return NextResponse.json(career);
  } catch (error) {
    console.error("Error creating career:", error);
    return NextResponse.json(
      { error: "Failed to create career listing" },
      { status: 500 }
    );
  }
}

