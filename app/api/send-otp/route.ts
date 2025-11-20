import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOTP } from "@/utils/messageSender";
import { generateOTP } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    // Generate a 4-digit OTP
    const otp = generateOTP();    
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Send OTP via MSG91
    const result = await sendOTP(phone, otp);
    // return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
    if (result.type === "error") {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    // Find user by phone number
    const user = await prisma.user.findUnique({ where: { phone } });
    // Check if user exists and OTP is valid
    if (user && user.otpExpiresAt && user.otpExpiresAt > new Date()) {
      return NextResponse.json({ message: "OTP already sent" }, { status: 400 });
    }

    // Create or update user with OTP
    await prisma.user.upsert({
      where: { phone },
      create: {
        phone,
        otp,
        otpExpiresAt,
        name: `User-${phone.slice(-4)}` // Temporary name
      },
      update: {
        otp,
        otpExpiresAt
      }
    });
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {    
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}