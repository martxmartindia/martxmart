import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc';

    const where: any = {
      isDeleted: false,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const additionalFilters = ['material', 'manufacturer', 'automation', 'warranty', 'madeIn'];
    additionalFilters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) where[filter] = { contains: value, mode: 'insensitive' };
    });

    const inStock = searchParams.get('inStock');
    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    const orderBy: any = {};
    if (sortBy === 'newest') {
      orderBy.createdAt = 'desc';
    } else if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { message: 'Error searching products' },
      { status: 500 }
    );
  }
}