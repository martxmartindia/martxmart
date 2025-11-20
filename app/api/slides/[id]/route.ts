import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const slide = await prisma.slide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slide' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const data = await req.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const slide = await prisma.slide.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.imageorVideo && { imageorVideo: data.imageorVideo }),
        ...(data.mobileImageorVideo && { mobileImageorVideo: data.mobileImageorVideo }),
        ...(data.link !== undefined && { link: data.link || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json({ message: 'Slide updated successfully', slide });
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    await prisma.slide.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    );
  }
}