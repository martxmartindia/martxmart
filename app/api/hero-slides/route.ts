import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const mockSlides = [
  {
    id: 1,
    imageorVideo: '/logo.png',
    mobileImageorVideo: '/logo.png',
    isActive: true,
  },
];

export async function GET() {
  try {
    const slides = await prisma.slide.findMany({
      where: { isActive: true,type:"MACHINE" },
      orderBy: { id: 'asc' },
    });

    if (!slides || slides.length === 0) {
      return NextResponse.json({ slides: mockSlides });
    }

    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.imageorVideo || !data.mobileImageorVideo) {
      return NextResponse.json(
        { error: 'Missing required fields: imageorVideo, mobileImageorVideo' },
        { status: 400 }
      );
    }

    // Validate URL format (basic check for image or video extensions)
    const validMediaTypes = /\.(jpg|jpeg|png|gif|mp4|webm|ogg)$/i;
    if (!validMediaTypes.test(data.imageorVideo) || !validMediaTypes.test(data.mobileImageorVideo)) {
      return NextResponse.json(
        { error: 'Invalid media format. Use jpg, jpeg, png, gif, mp4, webm, or ogg.' },
        { status: 400 }
      );
    }

    const slide = await prisma.slide.create({
      data: {
        imageorVideo: data.imageorVideo,
        mobileImageorVideo: data.mobileImageorVideo,
        link: data.link || null,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ message: 'Slide created successfully', slide }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();

    // Validate media URLs if provided
    if (data.imageorVideo || data.mobileImageorVideo) {
      const validMediaTypes = /\.(jpg|jpeg|png|gif|mp4|webm|ogg)$/i;
      if (
        (data.imageorVideo && !validMediaTypes.test(data.imageorVideo)) ||
        (data.mobileImageorVideo && !validMediaTypes.test(data.mobileImageorVideo))
      ) {
        return NextResponse.json(
          { error: 'Invalid media format. Use jpg, jpeg, png, gif, mp4, webm, or ogg.' },
          { status: 400 }
        );
      }
    }

    const slide = await prisma.slide.update({
      where: { id },
      data,
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.slide.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}