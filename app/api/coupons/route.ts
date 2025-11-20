import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { verifyJWT } from "@/utils/auth";

export async function GET(request: Request) {
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

  try {
    const decoded = await verifyJWT(token);

    if (!decoded || typeof decoded !== "object" || !decoded.payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.payload.id as string;

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
