import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/utils/auth";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: string;
}

export async function requireCustomer(req: NextRequest): Promise<AuthUser | NextResponse> {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || 
                  req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.payload.sub as string },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        isVerified: true,
        isDeleted: true,
      },
    });

    if (!user || user.isDeleted) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Access denied. Customer role required." },
        { status: 403 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Account not verified" },
        { status: 403 }
      );
    }

    return {
      id: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}

export async function getUserWithDb(req: NextRequest): Promise<AuthUser | null> {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || 
                  req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = await verifyJWT(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.payload.sub as string },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        isVerified: true,
        isDeleted: true,
      },
    });

    if (!user || user.isDeleted) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
}