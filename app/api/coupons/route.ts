import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";


export async function GET(request: Request) {
  // Try to get token from Authorization header first, then from cookies
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;

    const users = await getAuthenticatedUser();
    if (!users) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = users.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const coupons = await prisma.coupon.findMany({
      where: { 
        isActive: true, 
        isDeleted: false,
        expiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        code: true,
        discount: true,
        expiresAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(coupons, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
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
