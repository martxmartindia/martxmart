import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
 import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";


export async function POST(req: Request) {
  try {
    // Check authentication
   
    const authError = await requireAuth();
    if (authError) return authError;

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Process the file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    let url;
    try {
      url = await uploadImage(buffer);
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    } finally {
      // Clean up the file buffer
      buffer.fill(0);
    }

    return NextResponse.json({ url });

  } catch (error) {
    console.error('Error processing upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process upload';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}