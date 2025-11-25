import { prisma } from "@/lib/prisma";
import { signJWT } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";

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