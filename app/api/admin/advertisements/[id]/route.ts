import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const advertisement = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!advertisement) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json(advertisement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch advertisement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    const body = await request.json();
    const { name, image, offer, offerExpiry, benefits, link, bgColor, hoverColor, isActive, priority } = body;

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: {
        name,
        image,
        offer,
        offerExpiry,
        benefits,
        link,
        bgColor,
        hoverColor,
        isActive,
        priority
      }
    });

    return NextResponse.json(advertisement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update advertisement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.advertisement.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete advertisement' }, { status: 500 });
  }
}