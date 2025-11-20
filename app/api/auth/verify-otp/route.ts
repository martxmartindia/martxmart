import { prisma } from "@/lib/prisma";
import { signJWT } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";

const verifyOtpSchema = z
  .object({
    phone: z.string().min(10, "Invalid phone number").optional(),
    email: z.string().email("Invalid email address").optional(),
    otp: z
      .string()
      .length(4, "OTP must be 4 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
  })
  .refine((data) => data.phone || data.email, {
    message: "Either phone or email is required",
    path: ["identifier"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, email, otp } = verifyOtpSchema.parse(body);

    // Clean and validate identifier
    const identifierValue = phone ? phone.replace(/^\+?91/, "").trim() : email;

    if (phone && !/^\d{10}$/.test(identifierValue as string)) {
      throw ApiError.badRequest("Invalid phone number format. Must be 10 digits.");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifierValue as string)) {
      throw ApiError.badRequest("Invalid email address format");
    }

    // Find user by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone: identifierValue } : {},
          email ? { email: identifierValue } : {},
        ].filter(Boolean),
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
      throw ApiError.notFound("User not found with the provided phone or email");
    }

    // Verify OTP
    if (user.otp !== otp) {
      throw ApiError.badRequest("Invalid OTP");
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      throw ApiError.badRequest("OTP has expired");
    }

    // Generate JWT
    const token = await signJWT({
      id: user.id,
      email: user.email || "",
      name: user.name,
      role: user.role,
    });

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
    });

    // Prepare response, excluding sensitive fields
    const { otp: _, otpExpiresAt: __, ...userWithoutOtp } = user;
    return NextResponse.json(
      {
        message: "OTP verified successfully",
        token,
        user: userWithoutOtp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return handleApiError(error);
  }
}