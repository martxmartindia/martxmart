import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyPassword } from "@/utils/auth";
import { ApiError, handleApiError } from "@/lib/api-error";

// Schema for phone+password login
const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\+?91[6-9]\d{9}$|^[6-9]\d{9}$/, "Invalid phone number format"),
  password: z.string().min(1, "Password is required"),
  provider: z.literal("phone"),
});

// Schema for email+password login
const emailLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  provider: z.literal("email"),
});

const loginSchema = z.union([phoneLoginSchema, emailLoginSchema]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const credentials = loginSchema.parse(body);

    let user;
    let identifier;

    if (credentials.provider === "phone") {
      // Phone + password login
      const cleanPhone = credentials.phone.replace(/^\+?91/, "").trim();
      identifier = cleanPhone;
      
      user = await prisma.user.findUnique({
        where: { phone: cleanPhone },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          role: true,
          isVerified: true,
          isDeleted: true,
        }
      });
    } else {
      // Email + password login
      identifier = credentials.email.toLowerCase();
      
      user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          role: true,
          isVerified: true,
          isDeleted: true,
        }
      });
    }

    // Check if user exists
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw ApiError.unauthorized("Account has been deleted");
    }

    // Check if user is verified (must complete OTP verification first)
    if (!user.isVerified) {
      throw ApiError.unauthorized("Please verify your account before logging in");
    }

    // Check if user is a customer
    if (user.role !== "CUSTOMER") {
      throw ApiError.unauthorized("Invalid user type for customer login");
    }

    // Verify password
    if (!user.password) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isValidPassword = await verifyPassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Use NextAuth to sign in the user
    const result = await signIn("credentials", {
      redirect: false,
      [credentials.provider]: identifier,
      password: credentials.password,
    });

    if (result?.error) {
      throw ApiError.unauthorized("Login failed");
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return handleApiError(error);
  }
}