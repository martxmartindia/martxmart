import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
  // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

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