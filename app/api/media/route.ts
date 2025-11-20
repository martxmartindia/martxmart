import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET /api/media/press-releases
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const year = searchParams.get('year') || 'all';
    const category = searchParams.get('category') || 'all';

    const whereClause: any = {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ],
    };

    if (year !== 'all') {
      whereClause.AND = [
        {
          date: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${parseInt(year) + 1}-01-01`),
          },
        },
      ];
    }

    if (category !== 'all') {
      whereClause.category = category;
    }

    const pressReleases = await prisma.pressRelease.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(pressReleases);
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch press releases' },
      { status: 500 }
    );
  }
}

// POST /api/media/press-releases
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pressRelease = await prisma.pressRelease.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        excerpt: data.excerpt,
        category: data.category,
        image: data.image,
        content: data.content,
        slug: data.slug,
      },
    });

    return NextResponse.json(pressRelease);
  } catch (error) {
    console.error('Error creating press release:', error);
    return NextResponse.json(
      { error: 'Failed to create press release' },
      { status: 500 }
    );
  }
}