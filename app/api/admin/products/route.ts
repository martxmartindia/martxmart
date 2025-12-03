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
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const stock = searchParams.get("stock");
    const priceRange = searchParams.get("priceRange");
    const brand = searchParams.get("brand") || "";

    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json({ message: "Invalid page or limit" }, { status: 400 });  
    }

    // Build where clause
    const whereClause: any = {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            brand: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            hsnCode: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            category: {
              name: {
                contains: search,
                mode: 'insensitive' as const
              }
            }
          }
        ]
      }),
      ...(brand && {
        brand: {
          contains: brand,
          mode: 'insensitive' as const
        }
      }),
      ...(category && category !== 'all' && { categoryId: category }),
      ...(featured && featured !== 'all' && { featured: featured === 'true' })
    };

    // Handle stock filter
    if (stock && stock !== 'all') {
      if (stock === 'in_stock') {
        whereClause.stock = { gt: 10 };
      } else if (stock === 'low_stock') {
        whereClause.stock = { gte: 1, lte: 10 };
      } else if (stock === 'out_of_stock') {
        whereClause.stock = { equals: 0 };
      }
    }

    // Handle price range filter
    if (priceRange && priceRange !== 'all') {
      if (priceRange === '0-1000') {
        whereClause.price = { gte: 0, lte: 1000 };
      } else if (priceRange === '1000-5000') {
        whereClause.price = { gte: 1000, lte: 5000 };
      } else if (priceRange === '5000-10000') {
        whereClause.price = { gte: 5000, lte: 10000 };
      } else if (priceRange === '10000-50000') {
        whereClause.price = { gte: 10000, lte: 50000 };
      } else if (priceRange === '50000+') {
        whereClause.price = { gte: 50000 };
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.product.count({
        where: whereClause
      })
    ]);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      total,
      page,
      limit
    });

  } catch (error) {
    console.error("Error fetching products:", error);
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

    const { id, featured, isDeleted } = await req.json();
    
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        featured: featured !== undefined ? featured : product.featured,
        isDeleted: isDeleted !== undefined ? isDeleted : product.isDeleted
      },
      include: {
        category: true,
      }
    });

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}