import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { cookies } from 'next/headers';
import { verifyJWT as verifyJwtToken, signJWT } from '@/utils/auth';

export async function POST(req: Request) {
  try {
    // Check authentication
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = await verifyJwtToken(token);
    } catch (error: any) {
      if (error.message === 'Token expired') {
        // Try to refresh token
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        if (!refreshToken) {
          return NextResponse.json(
            { error: 'Session expired. Please login again.' },
            { status: 401 }
          );
        }

        try {
          const refreshDecoded = await verifyJwtToken(refreshToken, 'refresh');
          const payload = {
            id: refreshDecoded.payload.id as string,
            email: refreshDecoded.payload.email as string,
            name: refreshDecoded.payload.name as string,
            role: refreshDecoded.payload.role as string
          };

          const newAccessToken = await signJWT(payload, 'access');
          const cookieStore = cookies();
          (await cookieStore).set('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          });

          decoded = await verifyJwtToken(newAccessToken);
        } catch (refreshError) {
          return NextResponse.json(
            { error: 'Session expired. Please login again.' , refreshError },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    if (!decoded || typeof decoded !== 'object') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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