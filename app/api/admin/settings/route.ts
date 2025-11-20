import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/auth";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = {
      siteName: "martXmart",
      siteDescription: "Multi-vendor e-commerce platform",
      currency: "INR",
      taxRate: 18,
      shippingRate: 99,
      freeShippingThreshold: 999,
      codCharges: 49,
      maintenanceMode: false,
      allowRegistration: true,
      emailNotifications: true,
      smsNotifications: true,
    };

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await request.json();
    return NextResponse.json({ settings, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}