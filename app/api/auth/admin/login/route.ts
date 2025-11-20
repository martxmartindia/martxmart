import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { signJWT } from "@/utils/auth";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Find admin user
    const admin = await prisma.admin.findFirst({
      where: {
        email,
        role: "ADMIN",
      }
    });

    if (!admin) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password!);
    if (!isValidPassword) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Generate JWT token
    const token = await signJWT({
      id: admin.id as string,
      email: admin.email as string,
      role: Role.ADMIN,
      name: "Admin User"
    });

    const cookieStore =await cookies();
      cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

    // Return success response with token
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    // Handle API errors
    console.error("Error during login:", error);
    return handleApiError(error);
  }
}