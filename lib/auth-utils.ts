import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
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
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch additional user data from DB for verification
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
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

    if (!dbUser || dbUser.isDeleted) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (dbUser.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Access denied. Customer role required." },
        { status: 403 }
      );
    }

    if (!dbUser.isVerified) {
      return NextResponse.json(
        { error: "Account not verified" },
        { status: 403 }
      );
    }

    return {
      id: dbUser.id,
      email: dbUser.email || undefined,
      phone: dbUser.phone || undefined,
      name: dbUser.name,
      role: dbUser.role,
    };
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
}

export async function getUserWithDb(req: NextRequest): Promise<AuthUser | null> {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return null;
    }

    // Fetch additional user data from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
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

    if (!dbUser || dbUser.isDeleted) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email || undefined,
      phone: dbUser.phone || undefined,
      name: dbUser.name,
      role: dbUser.role,
    };
  } catch (error) {
    return null;
  }
}