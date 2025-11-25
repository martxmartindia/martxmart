import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/auth";
import { z } from "zod";
import { ApiError, handleApiError } from "@/lib/api-error";

const verifyRegistrationOtpSchema = z.object({
  phone: z.string().regex(/^\+?91[6-9]\d{9}$|^[6-9]\d{9}$/, "Invalid phone number format"),
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  fullName: z.string().min(2, "Full name is required").optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp, fullName } = verifyRegistrationOtpSchema.parse(body);

    // Clean phone number
    const cleanPhone = phone.replace(/^\+?91/, "").trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      throw ApiError.badRequest("Invalid phone number format. Must be 10 digits.");
    }

    // Find user by phone
    const user = await prisma.user.findFirst({
      where: {
        phone: cleanPhone,
        role: "CUSTOMER",
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found. Please complete registration first.");
    }

    // Verify OTP for registration
    const otpResult = await verifyOTP(
      user.phone || "", // Fallback to empty string if phone is null
      otp,
      "CUSTOMER_REGISTRATION"
    );

    if (!otpResult.success) {
      throw ApiError.badRequest(otpResult.message || "Invalid or expired OTP");
    }

    // Activate user account
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isVerified: true,
        name: fullName || user.name, // Update name if provided
      },
    });

    return NextResponse.json(
      {
        message: "Account activated successfully. You can now login with your credentials.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: true,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration OTP verification error:", error);
    return handleApiError(error);
  }
}