import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAndSendOTP } from "@/lib/auth";
import { z } from "zod";
import { ApiError, handleApiError } from "@/lib/api-error";

const forgotPasswordSchema = z.object({
  phone: z.string().regex(/^\+?91[6-9]\d{9}$|^[6-9]\d{9}$/, "Invalid phone number format"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = forgotPasswordSchema.parse(body);

    // Clean phone number
    const cleanPhone = phone.replace(/^\+?91/, "").trim();

    // Find user by phone
    const user = await prisma.user.findFirst({
      where: {
        phone: cleanPhone
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isDeleted: true,
      }
    });

    if (!user) {
      throw ApiError.notFound("User not found with provided phone number");
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw ApiError.unauthorized("Account has been deleted");
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw ApiError.unauthorized("Account is not verified. Please complete verification first.");
    }

    // Check if user is a customer
    if (user.role !== "CUSTOMER") {
      throw ApiError.unauthorized("Invalid user type for password recovery");
    }

    // Generate and send OTP for password recovery
    const otpResult = await generateAndSendOTP(
      user.phone || "", // Fallback to empty string if phone is null
      null, // No email
      "FORGOT_PASSWORD"
    );

    if (!otpResult.success) {
      throw ApiError.internal("Failed to send recovery OTP. Please try again.");
    }

    return NextResponse.json({
      message: "OTP sent successfully for password recovery",
      // Only return what's safe to expose
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone ? `****${user.phone.slice(-4)}` : null,
        email: user.email ? `${user.email.slice(0, 2)}***@${user.email.split('@')[1]}` : null,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Forgot password error:", error);
    return handleApiError(error);
  }
}