import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session) {
      return NextResponse.json({
        user: session.user,
        expires: session.expires,
      });
    } else {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { message: "Failed to get session" },
      { status: 500 }
    );
  }
}