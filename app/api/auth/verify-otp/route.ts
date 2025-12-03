import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { encode } from 'next-auth/jwt';

const verifyOtpSchema = z
  .object({
    phone: z.string().regex(/^\+?91[6-9]\d{9}$|^[6-9]\d{9}$/, "Invalid phone number format"),
    otp: z
      .string()
      .length(4, "OTP must be 4 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = verifyOtpSchema.parse(body);

    // Clean phone number
    const cleanPhone = phone.replace(/^\+?91/, "").trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      throw ApiError.badRequest("Invalid phone number format. Must be 10 digits.");
    }

    // Find user by phone
    const user = await prisma.user.findFirst({
      where: {
        phone: cleanPhone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        otp: true,
        otpExpiresAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found with the provided phone number");
    }

    // Verify OTP
    if (user.otp !== otp) {
      throw ApiError.badRequest("Invalid OTP");
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      throw ApiError.badRequest("OTP has expired");
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
    });

    // Create NextAuth JWT token
    const token = await encode({
      token: {
        sub: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
        role: user.role,
      },
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // Prepare response, excluding sensitive fields
    const { otp: _, otpExpiresAt: __, ...userWithoutOtp } = user;

    // Set NextAuth session cookie
    const response = NextResponse.json(
      {
        message: "OTP verified successfully",
        user: userWithoutOtp,
      },
      { status: 200 }
    );

    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return handleApiError(error);
  }
}