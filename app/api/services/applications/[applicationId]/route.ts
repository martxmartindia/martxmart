import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  const applicationId = (await params).applicationId;

  try {
    const application = await prisma.serviceApplication.findUnique({
      where: { id: applicationId },
      include: {
        service: { select: { title: true, priceAmount: true } },
        order: { select: { id: true, razorpayOrderId: true, amount: true, status: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
  }
}