import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hashPassword } from "@/utils/auth";
import { generateAndSendOTP } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/api-error";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  phone: z.string().regex(/^\+?91[6-9]\d{9}$|^[6-9]\d{9}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = registerSchema.parse(body);

    // Clean phone number
    const cleanPhone = phone.replace(/^\+?91/, "").trim();
    
    // Check if user already exists with phone
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: cleanPhone
      }
    });

    if (existingUser) {
      throw ApiError.badRequest("Phone number already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with pending verification status
    const user = await prisma.user.create({
      data: {
        name: name,
        phone: cleanPhone,
        email: email ? email.toLowerCase() : null,
        password: hashedPassword,
        role: "CUSTOMER",
        isVerified: false, // User must verify OTP before activation
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });

    // Generate and send OTP for phone verification only
    const otpResult = await generateAndSendOTP(
      cleanPhone, 
      null, // No email, SMS only
      "CUSTOMER_REGISTRATION"
    );

    if (!otpResult.success) {
      // If OTP sending fails, delete the created user
      await prisma.user.delete({ where: { id: user.id } });
      throw ApiError.internal("Failed to send verification OTP. Please try again.");
    }

    return NextResponse.json({
      message: "Registration successful. Please verify your phone with the OTP sent.",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return handleApiError(error);
  }
}