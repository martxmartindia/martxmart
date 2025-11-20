import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { sendOTP } from "@/utils/messageSender";
import { hashPassword, generateOTP } from "@/utils/auth";
import { otpVerificationEmail } from "@/email/template";

const forgotPasswordSchema = z.object({
  phone: z.string().min(10, "Invalid phone number").optional(),
  email: z.string().email("Invalid email address").optional(),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers")
    .optional(),
}).refine(
  (data) => data.phone || data.email, // At least one of phone or email must be provided
  { message: "Either phone or email is required" }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, email, newPassword, otp } = forgotPasswordSchema.parse(body);

    // Find user by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : {},
          email ? { email } : {},
        ].filter(Boolean),
      },
      select: {
        id: true,
        otp: true,
        name: true,
        otpExpiresAt: true,
        password: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found with the provided phone or email");
    }

    // Handle OTP generation and sending
    if (!otp && !newPassword) {
      const newOtp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiry

      // Update user with new OTP
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: newOtp, otpExpiresAt },
      });

      // provide email send otp on email and phone send otp on phone

      if (email) {
      await otpVerificationEmail(user.name, email, newOtp)
      } else if (phone) {
        const result = await sendOTP(phone, newOtp);
        if (result.type === "error") {
          throw ApiError.internal(result.message);
        }
      }

      return NextResponse.json({
        message: "OTP sent successfully. Please use it to reset your password.",
      });
    }

    // Handle OTP verification and password reset
    if (otp && newPassword) {
      if (user.otp !== otp) {
        throw ApiError.badRequest("Invalid OTP");
      }

      if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
        throw ApiError.badRequest("OTP has expired");
      }

      // Validate new password
      const hashedInput = await hashPassword(newPassword);
      if (user.password === hashedInput) {
        throw ApiError.badRequest("New password cannot be the same as the current one");
      }

      // Additional password strength checks
      if (
        newPassword === phone ||
        newPassword === email ||
        newPassword.includes(phone?.slice(-4) || "") ||
        /(\d)\1{3}/.test(newPassword)
      ) {
        throw ApiError.badRequest("Password is too weak or contains identifiable information");
      }

      // Update password and clear OTP
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedInput,
          otp: null,
          otpExpiresAt: null,
        },
      });

      return NextResponse.json({
        message: "Password updated successfully",
      });
    }

    throw ApiError.badRequest("Invalid request: Provide phone/email for OTP or OTP/newPassword for reset");
  } catch (error) {
    return handleApiError(error);
  }
}