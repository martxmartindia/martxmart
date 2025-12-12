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

    const [vendors, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "VENDOR",
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } }
          ],
          ...(status && { isVerified: status === "verified" })
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          vendorProfile: {
            include: {
              documents: true,
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.user.count({
        where: {
          role: "VENDOR",
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } }
          ],
          ...(status && { isVerified: status === "verified" })
        }
      })
    ]);

    // Process vendors to add a flag indicating if they have a vendor profile
    const processedVendors = vendors.map(vendor => ({
      ...vendor,
      hasVendorProfile: !!vendor.vendorProfile
    }));

    return NextResponse.json({
      vendors: processedVendors,
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

export async function PUT(req: Request) {
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 })
    }

    const { id, isVerified, isDeleted } = await req.json();
    
    const vendor = await prisma.user.findUnique({
      where: { id },
      include: { vendorProfile: true }
    });

    if (!vendor) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Allow updating users even if they don't have a vendor profile yet
    // They might be potential vendors who need profiles created
    const updatedVendor = await prisma.user.update({
      where: { id },
      data: {
        isVerified: isVerified !== undefined ? isVerified : vendor.isVerified,
        isDeleted: isDeleted !== undefined ? isDeleted : vendor.isDeleted,
        // Update role if provided and if it's a valid role change
        ...(isVerified === true && vendor.role !== "VENDOR" && { role: "VENDOR" })
      },
      include: {
        vendorProfile: {
          include: {
            documents: true,
          },
        }
      }
    });

    return NextResponse.json({
      message: "Vendor updated successfully",
      vendor: updatedVendor
    });

  } catch (error) {
    console.error("Error updating vendor:", error);
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

    const body = await req.json();
    const {
      // User creation fields (optional)
      name,
      email: userEmail,
      phone,
      // Vendor profile fields
      userId,
      businessName,
      businessType,
      address,
      city,
      state,
      pincode,
      website,
      gstNumber,
      panNumber,
      bankName,
      accountNumber,
      ifscCode,
      category,
      experience,
      annualTurnover,
      employeeCount,
      certifications,
      specializations,
      serviceAreas,
      status,
      isVerified,
      isActive
    } = body;

    let actualUserId = userId;

    // If user creation data is provided, create a new user
    if (name || userEmail || phone) {
      if (!name || !phone) {
        return NextResponse.json({
          error: "Name and phone are required for user creation"
        }, { status: 400 });
      }

      // Clean phone number
      const cleanPhone = phone.replace(/^\+?91/, "").trim();

      // Check if user already exists with phone
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: cleanPhone
        }
      });

      if (existingUser) {
        return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
      }

      // Check email uniqueness if provided
      if (userEmail) {
        const existingEmailUser = await prisma.user.findFirst({
          where: {
            email: userEmail.toLowerCase()
          }
        });

        if (existingEmailUser) {
          return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
      }

      // Create user without password (admin-created account)
      const newUser = await prisma.user.create({
        data: {
          name,
          phone: cleanPhone,
          email: userEmail ? userEmail.toLowerCase() : null,
          role: "VENDOR",
          isVerified: isVerified !== undefined ? isVerified : false,
          // No password for admin-created accounts - they'll need to reset it
        }
      });

      actualUserId = newUser.id;
    }

    // Validate required vendor profile fields
    if (!actualUserId || !businessName || !businessType) {
      return NextResponse.json({
        error: "Missing required fields: userId (or user creation data), businessName, and businessType are required"
      }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: actualUserId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if vendor profile already exists for this user
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId: actualUserId }
    });

    let vendorProfile;

    if (existingProfile) {
      // Update existing vendor profile
      vendorProfile = await prisma.vendorProfile.update({
        where: { userId: actualUserId },
        data: {
          businessName,
          businessType,
          address,
          city,
          state,
          pincode,
          phone,
          email: userEmail,
          website,
          gstNumber,
          panNumber,
          bankName,
          accountNumber,
          ifscCode,
          category,
          experience,
          annualTurnover,
          employeeCount,
          certifications: certifications || [],
          specializations: specializations || [],
          serviceAreas: serviceAreas || [],
          status: status || existingProfile.status,
          isVerified: isVerified !== undefined ? isVerified : existingProfile.isVerified,
          isActive: isActive !== undefined ? isActive : existingProfile.isActive
        },
        include: {
          user: true,
          documents: true
        }
      });
    } else {
      // Create new vendor profile
      vendorProfile = await prisma.vendorProfile.create({
        data: {
          userId: actualUserId,
          businessName,
          businessType,
          address,
          city,
          state,
          pincode,
          phone,
          email: userEmail,
          website,
          gstNumber,
          panNumber,
          bankName,
          accountNumber,
          ifscCode,
          category,
          experience,
          annualTurnover,
          employeeCount,
          certifications: certifications || [],
          specializations: specializations || [],
          serviceAreas: serviceAreas || [],
          status: status || "PENDING",
          isVerified: isVerified !== undefined ? isVerified : false,
          isActive: isActive !== undefined ? isActive : true
        },
        include: {
          user: true,
          documents: true
        }
      });
    }

    return NextResponse.json({
      message: existingProfile ? "Vendor updated successfully" : "Vendor created successfully",
      vendor: vendorProfile
    }, { status: existingProfile ? 200 : 201 });

  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}