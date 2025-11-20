import { NextResponse, NextRequest } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Define valid sort fields and order
const sortFields = ["createdAt", "price", "name"] as const;
const sortOrders = ["asc", "desc"] as const;

// Validation schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sortBy: z.enum(sortFields).default("createdAt"),
  sortOrder: z.enum(sortOrders).default("desc"),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  brand: z.array(z.string()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const parsedParams = querySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      brand: searchParams.getAll("brand"),
    });

    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsedParams.error },
        { status: 400 }
      );
    }

    const { page, limit, sortBy, sortOrder, minPrice, maxPrice, brand } = parsedParams.data;
    const skip = (page - 1) * limit;

    // Find category
    const category = await db.category.findFirst({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Build where clause with type safety
    const whereClause: Prisma.ShoppingWhereInput = {
      categoryId: category.id,
      // isActive: true,
    };

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = minPrice;
      if (maxPrice) whereClause.price.lte = maxPrice;
    }

    if (brand && brand.length > 0) {
      whereClause.brand = { in: brand };
    }

    // Fetch products and brands in a single transaction
    const [products, totalProducts, allBrands] = await db.$transaction([
      db.shopping.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      db.shopping.count({ where: whereClause }),
      db.shopping.findMany({
        where: { categoryId: category.id },
        select: { brand: true },
        distinct: ["brand"],
      }),
    ]);

    const filters = {
      brands: allBrands.map((b) => b.brand).filter((b): b is string => !!b),
      categories: [category],
    };

    return NextResponse.json({
      category,
      products,
      filters,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}