import { prisma } from "@/lib/prisma";
import { signJWT } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";

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

    if (!process.env.JWT_SECRET) {
      throw ApiError.internal("Server configuration error");
    }

    const token =await signJWT({
      id: user.id,
      email: user.email as string,
      name: user.name,
      role: user.role,
    });

    await prisma.user.update({
      where: { phone },
      data: { otp: null, otpExpiresAt: null }
    });

    const { ...userWithoutOtp } = user;

    return NextResponse.json({
      message: "Login successful",
      token,
      user: userWithoutOtp
    }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return handleApiError(error);
  }

}
