import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOTP } from "@/utils/messageSender";
import { signJWT, verifyPassword, generateOTP } from "@/utils/auth";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Phone number must start with 6, 7, 8, or 9")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.phone || data.email, {
  message: "Either phone number or email is required.",
  path: ["phone", "email"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { phone, email, password } = parsed.data;

    // Clean phone number if provided
    let cleanPhone: string | undefined;
    if (phone) {
      cleanPhone = phone.replace(/^\+?91/, "").trim();
      if (!/^\d{10}$/.test(cleanPhone)) {
        return NextResponse.json(
          { message: "Invalid phone number format. Must be 10 digits." },
          { status: 400 }
        );
      }
    }

    // Find user by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone: cleanPhone } : {},
          email ? { email: email.toLowerCase() } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isVerified: true,
        otpExpiresAt: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found or password not set. Please register." },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (user.isVerified) {
      if (!process.env.JWT_SECRET) {
        return NextResponse.json(
          { message: "Server configuration error." },
          { status: 500 }
        );
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
// TODO set token in localstorage

      return NextResponse.json(
        {
          message: "Login successful",
          token,
          user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        { status: 200 }
      );
    }

    // User not verified, check for existing OTP
    if (user.otpExpiresAt && user.otpExpiresAt > new Date()) {
      return NextResponse.json(
        { message: "OTP already sent. Please wait." },
        { status: 400 }
      );
    }

    // Generate and send OTP (only for phone-based login)
    if (phone && cleanPhone) {
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      const result = await sendOTP(cleanPhone, otp);
      if (result.type === "error") {
        return NextResponse.json({ message: result.message }, { status: 400 });
      }

      // Update user with OTP (do not set isVerified to true yet)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
          otpExpiresAt,
        },
      });
      return NextResponse.json(
        { message: "OTP sent successfully. Please verify your phone." },
        { status: 200 }
      );
    }

    // For email login, mark as verified since OTP is phone-based
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

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

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login Error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Failed to process login. Please try again." },
      { status: 500 }
    );
  }
}