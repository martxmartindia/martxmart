import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/utils/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  // Verify authentication
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const decoded = await verifyJWT(token);
    if (!decoded || typeof decoded !== 'object' || decoded.payload.role !== 'CUSTOMER') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const userId = decoded.payload.userId;
    const formData = await req.formData();
    const file = formData.get('file');
    const documentType = formData.get('type') as string;

    // Validate inputs
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'Please upload a valid file' },
        { status: 400 },
      );
    }

    if (!['GST', 'PAN', 'BANK', 'AADHAR', 'OTHER', 'UDYAM', 'APPLICATION'].includes(documentType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document type' },
        { status: 400 },
      );
    }

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: 'Please upload a valid PDF file' },
        { status: 400 },
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 },
      );
    }

    // Convert file to buffer and create data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUri = `data:application/pdf;base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    try {
      const uploadResult = await cloudinary.uploader.upload(fileUri, {
        upload_preset: process.env.CLOUDINARY_PRESET_NAME,
        resource_type: 'auto',
        folder: 'vendor_documents',
        public_id: `${documentType}_${userId}_${Date.now()}`, // Unique ID
      });

      // Find the user's pending vendor application
      const vendorApplication = await prisma.vendorApplication.findFirst({
        where: {
          userId: userId as string,
          status: 'PENDING',
        },
      });

      // Store document metadata in Prisma
      await prisma.vendorDocument.create({
        data: {
          vendorApplicationId: vendorApplication?.id,
          documentType,
          documentUrl: uploadResult.secure_url,
          isVerified: false,
          cloudinaryPublicId: uploadResult.public_id,
        },
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
      });
    } catch (cloudinaryError: any) {
      console.error('Cloudinary upload error:', {
        message: cloudinaryError.message,
        name: cloudinaryError.name,
        http_code: cloudinaryError.http_code,
      });

      if (cloudinaryError.message.includes('Upload preset')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Cloudinary upload preset not found. Please check your configuration.',
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Cloudinary upload failed: ${cloudinaryError.message || 'Unknown error'}`,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error('Upload error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to upload document',
      },
      { status: 500 },
    );
  }
}