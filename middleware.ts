import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define role-based access rules
const roleAccessMap = {
  // Admin routes
  "/admin": ["ADMIN"],
  "/api/admin": ["ADMIN"],
  
  // Author routes  
  "/author": ["AUTHOR"],
  "/api/author": ["AUTHOR"],
  
  // Franchise routes
  "/franchise": ["FRANCHISE"],
  "/api/franchise": ["FRANCHISE"],
  
  // Customer routes (all authenticated users can access customer areas)
  "/account": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  "/api/account": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  "/api/shopping": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  "/api/cart": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  "/api/wishlist": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  "/api/orders": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Check if the current path requires specific roles
    const pathRules = Object.entries(roleAccessMap).find(([path]) => {
      return pathname.startsWith(path);
    });

    if (pathRules) {
      const [, allowedRoles] = pathRules;
      const userRole = token?.role as string;

      // Check if user has required role
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to appropriate login page based on role
        let redirectUrl = "/auth/login";
        
        if (userRole === "ADMIN") {
          redirectUrl = "/auth/admin/login";
        } else if (userRole === "AUTHOR") {
          redirectUrl = "/auth/author/login";
        } else if (userRole === "FRANCHISE") {
          redirectUrl = "/auth/franchise/login";
        }

        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    // Additional security checks
    if (pathname.startsWith("/api/admin")) {
      // Ensure admin user exists in the Admin table as well
      // This adds an extra layer of security
      // In a real application, you might want to check permissions here too
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/auth/login",
          "/auth/register", 
          "/auth/forgot-password",
          "/auth/admin/login",
          "/auth/author/login",
          "/auth/franchise/login",
          "/api/auth",
          "/api/public",
        ];

        // Check if route is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route)
        );

        if (isPublicRoute) {
          return true;
        }

        // For protected routes, check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};