import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { encode } from 'next-auth/jwt';

const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must contain only numbers")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = verifyOtpSchema.parse(body);

    const user = await prisma.user.findUnique({ 
      where: { phone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        otp: true,
        otpExpiresAt: true
      }
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    if (user.otp !== otp) {
      throw ApiError.badRequest("Invalid OTP");
    }

    if (new Date() > (user.otpExpiresAt || new Date())) {
      throw ApiError.badRequest("OTP has expired");
    }

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

    await prisma.user.update({
      where: { phone },
      data: { otp: null, otpExpiresAt: null }
    });

    const { ...userWithoutOtp } = user;

    // Set NextAuth session cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutOtp
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
    console.error("Error during login:", error);
    return handleApiError(error);
  }

}
