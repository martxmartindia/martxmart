import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      fullName,
      email,
      phone,
      company,
      productCategory,
      productName,
      quantity,
      requirements,
      budget,
      timeframe,
      contactPreference,
      fileUrl,
    } = data;

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName,
        email,
        phone,
        company,
        productCategory,
        productName,
        quantity,
        requirements,
        budget,
        timeframe,
        contactPreference,
        fileUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Quote request submitted successfully", quoteRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quote request:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}