import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const services = await prisma.service.findMany({
      where: {
        category: category || undefined,
        // ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
      },
      select: {
        id: true,
        title: true,
        shortName: true,
        slug: true,
        description: true,
        priceAmount: true,
        category: true,
        imageUrl: true,
        processingTime: true,
        governmentFee: true,
      },
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}