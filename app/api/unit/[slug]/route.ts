import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {

    const slug = (await params).slug;
    const plant = await prisma.plant.findUnique({
      where: { slug },
      include: {
        plantCategory: {
          select: { name: true, slug: true },
        },
        products: {
          select: { id: true, name: true, slug: true, price: true, images: true },
        },
      },
    });

    if (!plant) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error('Error fetching unit details:', error);
    return NextResponse.json({ error: 'Failed to fetch unit details' }, { status: 500 });
  }
}