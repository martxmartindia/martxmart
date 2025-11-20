import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/utils/auth';

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
    // Temporarily allowing all authenticated users for testing
    // if (user.payload.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Unauthorized", role: user?.payload?.role }, { status: 403 });
    // }

    const { searchParams } = new URL(req.url);
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
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const data = await req.json();

    if (!data.name || !data.offer || !data.link) {
      return NextResponse.json(
        { error: 'Missing required fields: name, offer, link' },
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        name: data.name,
        image: data.image || null,
        offer: data.offer,
        offerExpiry: data.offerExpiry || 'Limited time offer',
        benefits: data.benefits || [],
        link: data.link,
        bgColor: data.bgColor || 'bg-orange-500',
        hoverColor: data.hoverColor || 'hover:bg-orange-600',
        priority: data.priority || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ 
      message: 'Advertisement created successfully', 
      advertisement 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Advertisement updated successfully', 
      advertisement 
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }

    await prisma.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Advertisement deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}