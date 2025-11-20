import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET /api/media/media-kits
export async function GET() {
  try {
    const mediaKits = await prisma.mediaKit.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(mediaKits);
  } catch (error) {
    console.error('Error fetching media kits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media kits' },
      { status: 500 }
    );
  }
}

// POST /api/media/media-kits
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const mediaKit = await prisma.mediaKit.create({
      data: {
        title: data.title,
        description: data.description,
        fileType: data.fileType,
        fileSize: data.fileSize,
        filePath: data.filePath,
      },
    });

    return NextResponse.json(mediaKit);
  } catch (error) {
    console.error('Error creating media kit:', error);
    return NextResponse.json(
      { error: 'Failed to create media kit' },
      { status: 500 }
    );
  }
}