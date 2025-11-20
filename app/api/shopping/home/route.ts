import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";

export async function GET(request: Request) {
  const start = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "SHOP";

    // Run all DB queries in parallel
    const [
      slides,
      featuredCategories,
      featuredProductsRaw,
      bestSellingProductsRaw,
      trendingProductsRaw,
      dealOfTheDayRaw,
      festivalProductsRaw,
      newArrivalsRaw,
    ] = await Promise.all([
      db.slide.findMany({
        where: { type: type as any, isActive: true },
        orderBy: { id: "asc" },
      }),

      db.category.findMany({
        where: { 
          type: type as any,
          parentId: null // Only fetch parent categories
        },
        include: {
          _count: {
            select: {
              shopping: {
                where: {
                  isDeleted: false,
                  isAvailable: true,
                },
              },
            },
          },
        },
        take: 8,
        orderBy: { name: "asc" },
      }),

      db.shopping.findMany({
        where: {
          isFeatured: true,
          isDeleted: false,
          isAvailable: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),

      db.shopping.findMany({
        where: {
          isDeleted: false,
          isAvailable: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),

      db.shopping.findMany({
        where: {
          isDeleted: false,
          isAvailable: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        take: 8,
        orderBy: { id: "desc" },
      }),

      db.shopping.findMany({
        where: {
          isDeleted: false,
          isAvailable: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        take: 8,
        orderBy: { price: "asc" },
      }),

      db.shopping.findMany({
        where: {
          isDeleted: false,
          isAvailable: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        take: 8,
        orderBy: { price: "desc" },
      }),

      db.shopping.findMany({
        where: {
          isDeleted: false,
          isAvailable: true,
        },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Function to calculate average rating
    const addRatings = (products: any[]) =>
      products.map((product) => ({
        ...product,
        averageRating:
          product.reviews.length > 0
            ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
              product.reviews.length
            : null,
        reviewCount: product._count.reviews,
        reviews: undefined,
        _count: undefined,
      }));

    return NextResponse.json({
      slides,
      featuredCategories,
      featuredProducts: addRatings(featuredProductsRaw),
      bestSellingProducts: addRatings(bestSellingProductsRaw),
      trendingProducts: addRatings(trendingProductsRaw),
      dealOfTheDay: addRatings(dealOfTheDayRaw),
      festivalProducts: addRatings(festivalProductsRaw),
      newArrivals: addRatings(newArrivalsRaw),
    });
  } catch (error) {
    console.error("❌ Home API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch home data" },
      { status: 500 }
    );
  }
}
