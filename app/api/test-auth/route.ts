import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ 
        error: "No token provided"
      }, { status: 401 });
    }

    const user = await verifyJWT(token);
    
    return NextResponse.json({ 
      message: "Token valid",
      user: user,
      role: user?.payload?.role,
      isAdmin: user?.payload?.role === "ADMIN"
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: "Token verification failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 403 });
  }
}