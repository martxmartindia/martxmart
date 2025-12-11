import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST() {
  try {
    // Get current session to verify user is logged in
    const session = await getServerSession(authOptions)
    
    if (!session) {
      // User is not logged in, return success anyway
      return NextResponse.json({
        success: true,
        message: "Already logged out"
      })
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    })
    
    // Clear NextAuth session cookies
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    response.cookies.set('next-auth.session-token.2', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    // Clear legacy token cookie if exists
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({
      error: "Logout failed"
    }, { status: 500 })
  }
}

 