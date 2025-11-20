// app/api/services/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
  ) {
    const slug = (await params).slug;
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        relatedServices: {
          select: { id: true, title: true, slug: true },
        },
      },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}
