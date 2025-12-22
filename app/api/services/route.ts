import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const available = searchParams.get('available');
    const sortBy = searchParams.get('sortBy') || 'title';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause for filtering
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause for sorting
    let orderBy: any = { createdAt: 'desc' }; // default
    
    switch (sortBy) {
      case 'price':
        orderBy = { priceAmount: sortOrder };
        break;
      case 'processingTime':
        orderBy = { processingTime: sortOrder };
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch services from database
    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          shortName: true,
          description: true,
          priceAmount: true,
          category: true,
          imageUrl: true,
          processingTime: true,
          governmentFee: true,
          features: true,
          createdAt: true,
        },
      }),
      prisma.service.count({ where }),
    ]);

    // Get unique categories
    const categories = await prisma.service.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      services,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      categories: categories.map(c => c.category),
    });

  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

