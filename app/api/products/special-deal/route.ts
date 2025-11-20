import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Product } from '@prisma/client';

interface SpecialProductsResponse {
  newArrivals: ApiProduct[];
  bestSellers: ApiProduct[];
  flashSales: ApiProduct[];
  specialDeals: ApiProduct[];
}

interface ApiProduct extends Omit<Product, 'price' | 'originalPrice' | 'shippingCharges' | 'gstPercentage' | 'weight' | 'discount' | 'createdAt' | 'updatedAt' | 'discountStartDate' | 'discountEndDate'> {
  price: number;
  originalPrice?: number | null;
  shippingCharges?: number | null;
  gstPercentage?: number | null;
  weight?: number | null;
  discount?: number | null;
  createdAt: string;
  updatedAt: string;
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  category?: { id: string; name: string } | null;
  reviews?: Array<{ id: string; rating: number }>;
}

// GET handler for special product categories
export async function GET(req: Request) {
  try {
    const limit = 8;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const now = new Date();

    // Execute queries sequentially to prevent memory corruption
    const newArrivals = await prisma.product.findMany({
      where: {
        isDeleted: false,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        category: { select: { id: true, name: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const bestSellers = await prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: { select: { id: true, name: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { reviewCount: 'desc' },
      take: limit,
    });

    const flashSales = await prisma.product.findMany({
      where: {
        isDeleted: false,
        discount: { gt: 0 },
        discountEndDate: { gte: now },
      },
      include: {
        category: { select: { id: true, name: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { discount: 'desc' },
      take: limit,
    });

    const specialDeals = await prisma.product.findMany({
      where: {
        isDeleted: false,
        featured: true,
      },
      include: {
        category: { select: { id: true, name: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { averageRating: 'desc' },
      take: limit,
    });

    // Transform products with safe number conversion
    const transformProducts = (products: any[]): ApiProduct[] => {
      return products.map((product) => {
        try {
          return {
            ...product,
            price: Number(product.price) || 0,
            originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
            shippingCharges: product.shippingCharges ? Number(product.shippingCharges) : null,
            gstPercentage: product.gstPercentage ? Number(product.gstPercentage) : null,
            weight: product.weight ? Number(product.weight) : null,
            discount: product.discount ? Number(product.discount) : null,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            discountStartDate: product.discountStartDate?.toISOString() ?? null,
            discountEndDate: product.discountEndDate?.toISOString() ?? null,
            averageRating: product.averageRating || (
              product.reviews?.length > 0 
                ? product.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / product.reviews.length 
                : 0
            ),
            reviewCount: product.reviewCount || product.reviews?.length || 0,
            certifications: product.certifications || [],
            industryType: product.industryType || [],
            applications: product.applications || [],
            accessories: product.accessories || [],
            documentationLinks: product.documentationLinks || [],
          };
        } catch (transformError) {
          console.error('Error transforming product:', transformError);
          return null;
        }
      }).filter(Boolean) as ApiProduct[];
    };

    const response = {
      newArrivals: transformProducts(newArrivals),
      bestSellers: transformProducts(bestSellers),
      flashSales: transformProducts(flashSales),
      specialDeals: transformProducts(specialDeals),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching special products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special products' },
      { status: 500 }
    );
  }
}