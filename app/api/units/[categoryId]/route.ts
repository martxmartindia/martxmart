import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET( request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    
  const categoryId = (await params).categoryId;
    const plants = await prisma.plant.findMany({
      where: { plantCategoryId: categoryId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
      },
    });
    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  }
}