import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { signOut } from "next-auth/react";

export async function POST() {
  try {
    // Get the current authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ message: "No active session" }, { status: 200 });
    }

    // Create response and clear the session cookie
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    
    // Clear all NextAuth session cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.session-token.0');
    response.cookies.delete('next-auth.session-token.1');
    response.cookies.delete('next-auth.session-token.2');
    response.cookies.delete('next-auth.session-token.3');
    response.cookies.delete('next-auth.session-token.4');
    response.cookies.delete('next-auth.session-token.5');
    response.cookies.delete('next-auth.session-token.6');
    response.cookies.delete('next-auth.session-token.7');
    response.cookies.delete('next-auth.session-token.8');
    response.cookies.delete('next-auth.session-token.9');
    
    // Also clear any vendor-specific cookies that might have been set
    response.cookies.delete('vendor-session');
    response.cookies.delete('token');
    
    console.log(`✅ [Vendor Logout] User ${user.email || user.phone} logged out successfully`);
    
    return response;
  } catch (error) {
    console.error("Vendor logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}