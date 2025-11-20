import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/auth";
import { Role } from "@/types";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user || user.payload.role !== Role.VENDOR) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Verified" });
  } catch (error) {
    console.error("Error during vendor verification:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}