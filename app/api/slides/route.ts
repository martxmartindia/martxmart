import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.imageorVideo || !data.mobileImageorVideo) {
      return NextResponse.json(
        { error: 'Missing required fields: imageorVideo, mobileImageorVideo' },
        { status: 400 }
      );
    }

    const slide = await prisma.slide.create({
      data: {
        type: data.type || 'MACHINE',
        imageorVideo: data.imageorVideo,
        mobileImageorVideo: data.mobileImageorVideo,
        link: data.link || null,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ message: 'Slide created successfully', slide }, { status: 201 });
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json(
      { error: 'Failed to create slide' },
      { status: 500 }
    );
  }
}