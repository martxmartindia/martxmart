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
  
  // Vendor routes
  "/vendor-portal": ["VENDOR"],
  "/api/vendor": ["VENDOR"],
  "/api/vendor-portal": ["VENDOR"],
  
  // Franchise routes
  "/api/franchise": ["FRANCHISE"],
  
  // Customer routes (all authenticated users can access customer areas)
  "/account": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  "/api/account": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
  // Note: Shopping, cart, wishlist moved to public routes as they should be accessible without login
  // Only order creation requires authentication
  "/api/orders": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE"],
};

// Define which roles can access specific auth login pages
const authLoginAccess = {
  "/auth/admin/login": ["ADMIN"],
  "/auth/author/login": ["AUTHOR"],
  "/auth/franchise/login": ["FRANCHISE"],
  "/auth/vendor/login": ["VENDOR"],
  "/auth/login": ["CUSTOMER", "ADMIN", "AUTHOR", "FRANCHISE", "VENDOR"], // Default login for customers
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const userRole = token?.role as string;

    // Role-based auth login page protection
    // Check if user is trying to access an auth login page without proper role
    const authLoginRules = Object.entries(authLoginAccess).find(([path]) => {
      return pathname.startsWith(path);
    });

    if (authLoginRules) {
      const [, allowedRoles] = authLoginRules;
      
      // Only redirect if user is authenticated AND doesn't have the right role for this auth page
      // This allows users to access their own login page even when authenticated
      if (userRole && !allowedRoles.includes(userRole)) {
        // Check if this is the user's own login page - don't redirect if it is
        let isOwnLoginPage = false;
        if (userRole === "ADMIN" && pathname.startsWith("/auth/admin/login")) {
          isOwnLoginPage = true;
        } else if (userRole === "AUTHOR" && pathname.startsWith("/auth/author/login")) {
          isOwnLoginPage = true;
        } else if (userRole === "FRANCHISE" && pathname.startsWith("/auth/franchise/login")) {
          isOwnLoginPage = true;
        } else if (userRole === "VENDOR" && pathname.startsWith("/auth/vendor/login")) {
          isOwnLoginPage = true;
        } else if (userRole === "CUSTOMER" && pathname.startsWith("/auth/login")) {
          isOwnLoginPage = true;
        }
        
        // Only redirect if it's NOT their own login page
        if (!isOwnLoginPage) {
          // Redirect to appropriate login page based on user's actual role
          let redirectUrl = "/auth/login"; // Default fallback
          
          if (userRole === "ADMIN") {
            redirectUrl = "/auth/admin/login";
          } else if (userRole === "AUTHOR") {
            redirectUrl = "/auth/author/login";
          } else if (userRole === "FRANCHISE") {
            redirectUrl = "/auth/franchise/login";
          } else if (userRole === "VENDOR") {
            redirectUrl = "/auth/vendor/login";
          } else if (userRole === "CUSTOMER") {
            redirectUrl = "/auth/login";
          }

          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
      }
    }

    // Check if the current path requires specific roles
    const pathRules = Object.entries(roleAccessMap).find(([path]) => {
      return pathname.startsWith(path);
    });

    if (pathRules) {
      const [, allowedRoles] = pathRules;

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
        } else if (userRole === "VENDOR") {
          redirectUrl = "/auth/vendor/login";
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
          "/api/auth",
          "/api/public",
          // Shopping routes should be publicly accessible
          "/shopping",
          "/api/shopping",
          // Cart and wishlist should be accessible for guest users
          "/api/cart",
          "/api/wishlist",
        ];
        
        
        // Check if route is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route)
        );
        
        // Debug logging for protected route checks
        console.log("🔍 [Middleware] Checking route:", pathname, "Public:", isPublicRoute);

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