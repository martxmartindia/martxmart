import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock data since we don't have admin profile in DB
    const profile = {
      name: session.user.name || "",
      email: session.user.email || "",
      phone: "",
      bio: "",
      address: "",
      avatarUrl: "",
      socialLinks: {
        twitter: "",
        linkedin: "",
        github: "",
      },
    };

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // For now, just return the data since we don't have admin profile in DB
    return NextResponse.json({ ...data, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}