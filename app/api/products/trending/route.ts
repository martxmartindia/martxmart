import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    // Get trending products based on a combination of:
    // 1. Recent orders (last 30 days)
    // 2. Average rating
    // 3. Number of reviews
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      take: limit,
      skip,
      orderBy: [
        {
          orderItems: {
            _count: "desc",
          },
        },
        {
          averageRating: "desc",
        },
        {
          reviewCount: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        shippingCharges: true,
        gstPercentage: true,
        weight: true,
        discount: true,
        discountType: true,
        discountStartDate: true,
        discountEndDate: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
        averageRating: true,
        reviewCount: true,
        brand: true,
      },
    });

    // Serialize Decimal and Date fields
    const serializedProducts = products.map(product => ({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
      gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
      weight: product.weight ? Number(product.weight) : null,
      discount: product.discount ? Number(product.discount) : null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      discountStartDate: product.discountStartDate?.toISOString() ?? null,
      discountEndDate: product.discountEndDate?.toISOString() ?? null,
    }));

    const totalProducts = await prisma.product.count({
      where: {
        isDeleted: false,
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products: serializedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 }
    );
  }
}