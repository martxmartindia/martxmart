import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { offer: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const [advertisements, total] = await Promise.all([
      prisma.advertisement.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.advertisement.count({ where })
    ]);

    return NextResponse.json({
      advertisements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, image, offer, offerExpiry, benefits, link, bgColor, hoverColor, isActive, priority } = body;

    const advertisement = await prisma.advertisement.create({
      data: {
        name,
        image,
        offer,
        offerExpiry,
        benefits,
        link,
        bgColor: bgColor || 'bg-orange-500',
        hoverColor: hoverColor || 'hover:bg-orange-600',
        isActive: isActive ?? true,
        priority: priority || 0
      }
    });

    return NextResponse.json(advertisement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}