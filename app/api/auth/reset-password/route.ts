import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/auth";
import { hashPassword } from "@/utils/auth";
import { z } from "zod";
import { ApiError, handleApiError } from "@/lib/api-error";

const resetPasswordSchema = z.object({
  phone: z.string().min(10, "Invalid phone number").optional(),
  email: z.string().email("Invalid email address").optional(),
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
}).refine((data) => data.phone || data.email, {
  message: "Either phone or email is required",
  path: ["identifier"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, email, otp, newPassword } = resetPasswordSchema.parse(body);

    // Clean and validate identifier
    const identifierValue = phone ? phone.replace(/^\+?91/, "").trim() : email?.toLowerCase().trim();

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
        role: "CUSTOMER",
        isVerified: true,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found with provided credentials");
    }

    // Verify OTP for password reset
    const otpResult = await verifyOTP(
      user.phone || "",
      user.email || "",
      otp,
      "FORGOT_PASSWORD"
    );

    if (!otpResult.success) {
      throw ApiError.badRequest(otpResult.message || "Invalid or expired OTP");
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        message: "Password reset successfully. You can now login with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return handleApiError(error);
  }
}