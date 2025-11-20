import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const currentDate = new Date();
    const deals = await prisma.product.findMany({
      where: {
        isDeleted: false,
        discount: { gt: 0 },
        discountStartDate: { lte: currentDate },
        discountEndDate: { gt: currentDate },
      },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        description: true,
        images: true,
        discount: true,
        discountType: true,
        discountStartDate: true,
        discountEndDate: true,
        category: {
          select: {
            name: true
          }
        },
        brand: true,
        averageRating: true,
        reviewCount: true
      },
      orderBy: {
        discount: 'desc'
      },
      take: 8
    });

    // Transform the data to match the frontend requirements
    const transformedDeals = deals.map(deal => {
      let finalPrice = Number(deal.price);
      let discountText = '';

      if (deal.discountType === 'PERCENTAGE') {
        finalPrice = Number(deal.price) * (1 - ((deal.discount ?? 0) / 100));
        discountText = `${deal.discount}% OFF`;
      } else if (deal.discountType === 'FIXED_AMOUNT') {
        finalPrice = Math.max(0, Number(deal.price) - Number(deal.discount));
        discountText = `₹${deal.discount} OFF`;
      } else if (deal.discountType === 'BUY_ONE_GET_ONE') {
        discountText = 'Buy 1 Get 1 Free';
      }

      return {
        id: deal.id,
        name: deal.name,
        price: finalPrice,
        originalPrice: Number(deal.originalPrice || deal.price),
        description: deal.description,
        images: deal.images,
        discount: discountText,
        category: deal.category?.name,
        brand: deal.brand,
        averageRating: deal.averageRating,
        reviewCount: deal.reviewCount,
        startDate: deal.discountStartDate?.toISOString().split('T')[0],
        endDate: deal.discountEndDate?.toISOString().split('T')[0]
      };
    });

    return NextResponse.json({ deals: transformedDeals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}