import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {signJWT}  from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate vendor credentials
    const vendor = await prisma.user.findFirst({
      where: {
        email,
        password,
        role: "VENDOR"
      }
    });

    if (!vendor) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signJWT({
      id: vendor.id,
      name: vendor.name,
      role: vendor.role
    });

    return NextResponse.json(
      { 
        message: "Login successful",
        token,
        user: {
          id: vendor.id,
          email: vendor.email,
          name: vendor.name,
          role: vendor.role
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Vendor login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}