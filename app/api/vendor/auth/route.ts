import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword } from "@/utils/auth";
import { encode } from 'next-auth/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find vendor user
    const vendor = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: "VENDOR",
        isDeleted: false,
      }
    });

    if (!vendor || !vendor.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, vendor.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create NextAuth JWT token
    const token = await encode({
      token: {
        sub: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone || undefined,
        role: vendor.role,
      },
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // Set NextAuth session cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: vendor.id,
        email: vendor.email,
        name: vendor.name,
        role: vendor.role
      }
    }, { status: 200 });

    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Vendor login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}