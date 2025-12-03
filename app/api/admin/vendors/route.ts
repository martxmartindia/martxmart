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

    if (!vendor || vendor.role !== "VENDOR") {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const updatedVendor = await prisma.user.update({
      where: { id },
      data: {
        isVerified: isVerified !== undefined ? isVerified : vendor.isVerified,
        isDeleted: isDeleted !== undefined ? isDeleted : vendor.isDeleted
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