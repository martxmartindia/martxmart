import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    const searchParams = new URL(req.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ message: "Invalid pagination parameters" }, { status: 400 });
    }

    // Build where clause for vendorProfile status filtering
    const vendorProfileWhere: any = {};
    if (status) {
      vendorProfileWhere.status = status.toUpperCase();
    }

    const [vendors, total] = await Promise.all([
      prisma.vendorProfile.findMany({
        where: {
          ...(Object.keys(vendorProfileWhere).length > 0 && { status: vendorProfileWhere.status }),
          OR: search ? [
            { businessName: { contains: search, mode: "insensitive" as const } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
            { user: { phone: { contains: search, mode: "insensitive" as const } } }
          ] : undefined
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          documents: true,
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.vendorProfile.count({
        where: {
          ...(Object.keys(vendorProfileWhere).length > 0 && { status: vendorProfileWhere.status }),
          OR: search ? [
            { businessName: { contains: search, mode: "insensitive" as const } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
            { user: { phone: { contains: search, mode: "insensitive" as const } } }
          ] : undefined
        }
      })
    ]);

    return NextResponse.json({
      vendors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });

  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    const { 
      userId, 
      businessName, 
      businessType, 
      gstin, 
      panNumber, 
      bankName,
      accountNumber,
      ifscCode,
      status = "PENDING"
    } = await req.json();

    // Validate required fields
    if (!userId || !businessName || !businessType) {
      return NextResponse.json({ 
        message: "Missing required fields: userId, businessName, businessType" 
      }, { status: 400 });
    }

    // Check if user exists and is not already a vendor
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendorProfile: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.vendorProfile) {
      return NextResponse.json({ message: "User already has a vendor profile" }, { status: 400 });
    }

    // Create vendor profile (using correct schema field names and enum values)
    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId,
        businessName,
        businessType,
        gstNumber: gstin, // Fixed: gstNumber not gstin
        panNumber,
        bankName, // Fixed: use individual bank fields instead of bankDetails object
        accountNumber,
        ifscCode,
        status: status.toUpperCase(), // Ensure uppercase for enum
        isVerified: status.toUpperCase() === "ACTIVE" // Fixed: ACTIVE not APPROVED
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        documents: true,
      }
    });

    // If status is ACTIVE, update user role to VENDOR (using correct enum value)
    if (status.toUpperCase() === "ACTIVE") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "VENDOR" }
      });
    }

    return NextResponse.json({
      message: "Vendor created successfully",
      vendor: vendorProfile
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}