import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { sendOTP } from "@/utils/messageSender";
import {generateOTP,hashPassword, signJWT} from "@/utils/auth"
import {welcomeEmail} from "@/email/template";
import { cookies } from "next/headers";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().email("Invalid email address").optional().transform(e => e || undefined),
  password: z.string().min(6, "Password must be at least 8 characters")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);
    const { name, phone, email } = validatedData;
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Check if user already exists with phone or email
    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone,email }
    });

    if (existingUserByPhone) {
      throw ApiError.badRequest("A user with this phone number already exists");
    }

    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUserByEmail) {
        throw ApiError.badRequest("A user with this email already exists");
      }
    }
    // otp expiry is 5min
    const otp=generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  
    // Create user with pending verification
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
        isVerified: false
      }
    });

    // Send OTP
    const result = await sendOTP(phone, otp);
    if (result.type === "error") {
      // Rollback user creation if OTP sending fails
      await prisma.user.delete({ where: { id: user.id } });
      throw ApiError.internal(result.message);
    }

    await prisma.user.update({
      where: { phone: phone },
      data: {
        otp,
        otpExpiresAt,
        isVerified: true, // Set isVerified to true ,
      },
    });
    // TODO send welcome email to user
    if (email) {
      await welcomeEmail(name, email);
    }

     const token = await signJWT({
            id: user.id,
            email: user.email || "",
            name: user.name,
            role: user.role,
          });
          const cookieStore = await cookies();
          cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });

    return NextResponse.json({
      message: "Registration initiated. Please verify your phone number.",
      id: user.id,
      name: user.name,
      email: user.email,
        }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}