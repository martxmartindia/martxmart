import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET( request: NextRequest,
  { params }: { params: Promise<{ projectType: string }> },
) {
  const projectType = (await params).projectType;
  try {
    const categoryNames: { [key: string]: string[] } = {
      'food-processing': [
        'Dairy Processing',
        'Grains & Pulses Processing',
        'Oil & Fats',
        'Spices & Condiments',
        'Fruits & Vegetables Processing',
        'Bakery & Confectionery',
        'Snacks & Namkeen Processing',
        'Meat, Fish & Egg Processing',
        'Beverages',
        'Ready-to-Eat & Instant Food',
        'Cold Chain & Packaging',
        'Animal Feed from Agro Waste',
        'Miscellaneous',
      ],
      'manufacturing': [
        'Garment & Textile Manufacturing',
        'Leather & Leather Products Manufacturing',
        'Wood & Furniture Manufacturing',
        'Chemical & Allied Products Manufacturing',
        'Paper, Packaging & Stationery Products',
        'Plastic, PVC & Polymer Products',
        'Rubber & Related Products',
        'Metal Products & Engineering Units',
        'Clay, Cement & Building Materials Manufacturing',
        'Electrical & Electronics Manufacturing',
        'Miscellaneous Manufacturing',
      ],
      'service-sector': [
        'Digital & IT Services',
        'Repair & Maintenance Services',
        'Printing & Related Services',
        'Personal Care & Beauty Services',
        'Healthcare & Wellness Services',
        'Educational & Training Services',
        'Event & Entertainment Services',
        'Cleaning & Sanitation Services',
        'Transportation & Vehicle Services',
        'Food & Catering Services',
        'Agriculture & Allied Services',
        'Renewable Energy & Environment Services',
        'Miscellaneous Services',
      ],
    };

    const categories = await prisma.plantCategory.findMany({
      where: {
        name: {
          in: categoryNames[projectType] || [],
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}