import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";
import { cookies, headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;

    // Get token from Authorization header or cookies
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    let token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      token = (await cookies()).get("token")?.value;
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== "object" || !decoded.payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.payload.id as string;

    // Try to find in career applications first
    const careerApplication = await prisma.application.findFirst({
      where: { 
        id: applicationId,
        userId 
      },
      include: {
        career: {
          select: {
            title: true,
            type: true,
            description: true,
          },
        },
      },
    });

    if (careerApplication) {
      return NextResponse.json({
        id: careerApplication.id,
        type: careerApplication.career?.type || "Career Application",
        title: careerApplication.career?.title,
        status: careerApplication.status,
        createdAt: careerApplication.createdAt.toISOString(),
        updatedAt: careerApplication.updatedAt.toISOString(),
        name: careerApplication.name,
        email: careerApplication.email,
        phone: careerApplication.phone,
        careerId: careerApplication.careerId,
        service: careerApplication.career ? {
          title: careerApplication.career.title,
          description: careerApplication.career.description,
        } : undefined,
      });
    }

    // Try to find in service applications
    const serviceApplication = await prisma.serviceApplication.findFirst({
      where: { 
        id: applicationId,
        userId 
      },
      include: {
        service: {
          select: {
            title: true,
            description: true,
          },
        },
        order: {
          select: {
            id: true,
            amount: true,
            totalAmount: true,
            status: true,
          },
        },
        documents: {
          select: {
            id: true,
            documentType: true,
            documentUrl: true,
            isVerified: true,
            uploadedAt: true,
          },
        },
        notes: {
          select: {
            id: true,
            note: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (serviceApplication) {
      return NextResponse.json({
        id: serviceApplication.id,
        type: serviceApplication.serviceApplicationType,
        title: serviceApplication.service?.title,
        status: serviceApplication.status,
        createdAt: serviceApplication.createdAt.toISOString(),
        updatedAt: serviceApplication.updatedAt.toISOString(),
        fullName: serviceApplication.fullName,
        businessName: serviceApplication.businessName,
        email: serviceApplication.email,
        phone: serviceApplication.phone,
        address: serviceApplication.address,
        city: serviceApplication.city,
        state: serviceApplication.state,
        pincode: serviceApplication.pincode,
        message: serviceApplication.message,
        gstType: serviceApplication.gstType,
        annualTurnover: serviceApplication.annualTurnover,
        businessType: serviceApplication.businessType,
        msmeCategory: serviceApplication.msmeCategory,
        investmentInPlant: serviceApplication.investmentInPlant,
        numberOfEmployees: serviceApplication.numberOfEmployees,
        companyType: serviceApplication.companyType,
        proposedNames: serviceApplication.proposedNames,
        businessActivity: serviceApplication.businessActivity,
        trademarkType: serviceApplication.trademarkType,
        trademarkClass: serviceApplication.trademarkClass,
        logoUrl: serviceApplication.logoUrl,
        serviceId: serviceApplication.serviceId,
        serviceOrderId: serviceApplication.serviceOrderId,
        assignedToUserId: serviceApplication.assignedToUserId,
        service: serviceApplication.service ? {
          title: serviceApplication.service.title,
          description: serviceApplication.service.description,
        } : undefined,
        order: serviceApplication.order,
        documents: serviceApplication.documents,
        notes: serviceApplication.notes,
      });
    }

    // Application not found
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );

  } catch (error) {
    console.error("Error in /api/applications/[applicationId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}