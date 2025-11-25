import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOTP } from "@/lib/auth";
import { z } from "zod";

const sendOTPSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Phone number must start with 6, 7, 8, or 9")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  purpose: z.enum([
    "CUSTOMER_LOGIN",
    "CUSTOMER_REGISTRATION",
    "ADMIN_LOGIN", 
    "AUTHOR_LOGIN",
    "FRANCHISE_LOGIN",
    "FORGOT_PASSWORD",
    "PHONE_VERIFICATION",
    "EMAIL_VERIFICATION",
  ]),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email is required",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendOTPSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          message: parsed.error.errors.map((e) => e.message).join(", "),
          type: "validation_error"
        },
        { status: 400 }
      );
    }

    const { phone, email, purpose } = parsed.data;
    const result = await generateAndSendOTP(phone || "", email || "", purpose);

    if (result.success) {
      return NextResponse.json(
        { 
          message: result.message,
          type: "success"
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          message: result.message,
          type: "error"
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Send OTP API error:", error);
    return NextResponse.json(
      { 
        message: "Failed to send OTP. Please try again.",
        type: "server_error"
      },
      { status: 500 }
    );
  }
}