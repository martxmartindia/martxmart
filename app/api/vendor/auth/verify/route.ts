import { NextResponse } from "next/server";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";
import { Role } from "@/types";

export async function GET(req: Request) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    const user = await getAuthenticatedUser();
    if (!user || user.role !== Role.VENDOR) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Verified" });
  } catch (error) {
    console.error("Error during vendor verification:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}