import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { GSTType } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const body = await request.json();
  const {
    serviceId,
    serviceApplicationType,
    fullName,
    email,
    phone,
    businessName,
    address,
    city,
    state,
    pincode,
    message,
    gstType,
    annualTurnover,
    businessType,
    msmeCategory,
    investmentInPlant,
    numberOfEmployees,
    companyType,
    proposedNames,
    businessActivity,
    trademarkType,
    trademarkClass,
    logoUrl,
  } = body;

  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const decodedToken = await verifyJWT(token)
    if (!decodedToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = decodedToken.payload.id
    
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const order = await prisma.serviceOrder.create({
      data: {
        serviceId,
        userId: userId as string,
        amount: service.priceAmount,
        totalAmount: service.priceAmount,
        status: "PENDING",
        paymentMethod: "RAZORPAY",
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        razorpayOrderId: null,

      },
    });


    const razorpayOrder = await razorpay.orders.create({
      amount: service.priceAmount * 100, // Convert to paise
      currency: "INR",
      receipt: order.id,
    });

    await prisma.serviceOrder.update({
  where: { id: order.id },
  data: { razorpayOrderId: razorpayOrder.id },
});

    const application = await prisma.serviceApplication.create({
      data: {
        serviceId,
        userId: userId as string,
        serviceOrderId: order.id,
        serviceApplicationType,
        fullName,
        email,
        phone,
        businessName,
        address,
        city,
        state,
        pincode,
        message,
        status: "PENDING",
gstType: gstType || null, // Convert "" to null        annualTurnover,
        businessType,
        msmeCategory:msmeCategory || null, // Convert "" to null
        investmentInPlant: investmentInPlant ? parseFloat(investmentInPlant) : null,
        numberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : null,
        companyType:companyType || null, // Convert "" to null
        proposedNames,
        businessActivity,
        trademarkType:trademarkType || null, // Convert "" to null
        trademarkClass: trademarkClass ? parseInt(trademarkClass) : null,
        logoUrl,
      },
    });

    return NextResponse.json(
      {
        applicationId: application.id,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: service.priceAmount * 100,
        currency: "INR",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Service application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}