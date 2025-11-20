import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the token cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return response;
  } catch (error) {
    console.error("Error during vendor logout:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}