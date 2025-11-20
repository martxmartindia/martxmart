import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";
import { cookies, headers } from "next/headers";

export async function GET(request: Request) {
  try {
    // Try to get token from Authorization header first, then from cookies
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

    // Fetch career-related applications (Application model)
    const careerApplications = await prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        name: true,
        careerId: true,
        career: {
          select: {
            title: true,
            type: true,
          },
        },
      },
    });

    // Fetch service-related applications (ServiceApplication model)
    const serviceApplications = await prisma.serviceApplication.findMany({
      where: { userId },
      select: {
        id: true,
        serviceApplicationType: true,
        status: true,
        createdAt: true,
        businessName: true,
        serviceId: true,
        service: {
          select: {
            title: true,
          },
        },
      },
    });

    // Combine and normalize the data
    const combinedApplications = [
      ...careerApplications.map((app) => ({
        id: app.id,
        type: app.career?.type || "Career Application",
        title: app.career?.title,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        name: app.name,
        businessName: app.name,
        careerId: app.careerId,
      })),
      ...serviceApplications.map((app) => ({
        id: app.id,
        type: app.serviceApplicationType,
        title: app.service?.title,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        name: app.businessName,
        businessName: app.businessName,
        serviceId: app.serviceId,
      })),
    ];

    return NextResponse.json(combinedApplications, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error("Error in /api/applications:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}