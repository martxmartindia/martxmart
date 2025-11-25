import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Get authenticated user from NextAuth session
 * Returns the user object or null if not authenticated
 */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }
  
  return {
    id: session.user.id,
    role: session.user.role,
    email: session.user.email,
    phone: session.user.phone,
    name: session.user.name,
  };
}

/**
 * Require authentication - returns NextResponse with 401 if not authenticated
 * Use this in API routes to protect endpoints
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json({ 
      error: "Unauthorized",
      message: "Authentication required"
    }, { status: 401 });
  }
  
  return null; // No error, user is authenticated
}

/**
 * Require specific role - returns NextResponse with 403 if wrong role
 */
export async function requireRole(requiredRole: string) {
  const authError = await requireAuth();
  if (authError) return authError;
  
  const user = await getAuthenticatedUser();
  
  if (user?.role !== requiredRole) {
    return NextResponse.json({ 
      error: "Forbidden",
      message: `Access denied. Required role: ${requiredRole}`
    }, { status: 403 });
  }
  
  return null; // No error, user has required role
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(allowedRoles: string[]) {
  const authError = await requireAuth();
  if (authError) return authError;
  
  const user = await getAuthenticatedUser();
  
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return NextResponse.json({ 
      error: "Forbidden", 
      message: `Access denied. Required roles: ${allowedRoles.join(", ")}`
    }, { status: 403 });
  }
  
  return null; // No error, user has required role
}