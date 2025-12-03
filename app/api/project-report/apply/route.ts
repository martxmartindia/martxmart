// app/api/project-report-applications/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth-helpers';
import Prisma from '@prisma/client';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface JWTPayload {
  id: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const userAuth = await requireAuth();
    if (userAuth instanceof NextResponse) return userAuth;
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const formData = await request.formData();

    // Extract and validate form fields
    const tradeName = formData.get('tradeName')?.toString();
    const applicantName = formData.get('applicantName')?.toString();
    const fatherName = formData.get('fatherName')?.toString();
    const dobName = formData.get('dobName')?.toString();
    const panCard = formData.get('panCard')?.toString();
    const aadharCard = formData.get('aadharCard')?.toString();
    const activityNatureOfProduct = formData.get('activityNatureOfProduct')?.toString();
    const totalProjectCost = formData.get('totalProjectCost')?.toString();
    const residencePincode = formData.get('residencePincode')?.toString();
    const residenceState = formData.get('residenceState')?.toString();
    const residenceAddress = formData.get('residenceAddress')?.toString();
    const residenceDistrict = formData.get('residenceDistrict')?.toString();
    const plantPincode = formData.get('plantPincode')?.toString();
    const plantState = formData.get('plantState')?.toString();
    const plantAddress = formData.get('plantAddress')?.toString();
    const plantDistrict = formData.get('plantDistrict')?.toString();
    const projectId = formData.get('projectId')?.toString();

    // Validate required fields
    const requiredFields = {
      tradeName,
      applicantName,
      fatherName,
      dobName,
      panCard,
      aadharCard,
      activityNatureOfProduct,
      totalProjectCost,
      residencePincode,
      residenceState,
      residenceAddress,
      residenceDistrict,
      plantPincode,
      plantState,
      plantAddress,
      plantDistrict,
      projectId,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Validate totalProjectCost
    const projectCost = parseFloat(totalProjectCost!);
    if (isNaN(projectCost) || projectCost < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid total project cost' },
        { status: 400 }
      );
    }

    // Validate projectId (could be id or slug)
    let project = await prisma.project.findUnique({
      where: { id: projectId! },
    });
    
    // If not found by id, try by slug
    if (!project) {
      project = await prisma.project.findUnique({
        where: { slug: projectId! },
      });
    }
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Handle file uploads
    const files = {
      panCardFile: formData.get('panCardFile') as File | null,
      aadharCardFile: formData.get('aadharCardFile') as File | null,
      quotationFile: formData.get('quotationFile') as File | null,
      udyamRegFile: formData.get('udyamRegFile') as File | null,
      applyFormFile: formData.get('applyFormFile') as File | null,
    };

    const uploadPromises = Object.entries(files)
      .filter(([_, file]) => file)
      .map(async ([key, file]) => {
        const buffer = await file!.arrayBuffer();
        const result = await cloudinary.uploader.upload(
          `data:${file!.type};base64,${Buffer.from(buffer).toString('base64')}`,
          { folder: 'project-reports/documents' }
        );
        return { key: key.replace('File', ''), url: result.secure_url };
      });

    const uploadResults = await Promise.all(uploadPromises);

    // Create document URLs object
    const documentUrls = uploadResults.reduce(
      (acc, { key, url }) => {
        acc[key] = url;
        return acc;
      },
      { panCard: null, aadharCard: null, quotation: null, udyamReg: null, applyForm: null } as Record<string, string | null>
    );

    // Create application data for Json field
    const applicationData = {
      tradeName,
      applicantName,
      fatherName,
      dobName,
      panCard,
      aadharCard,
      activityNatureOfProduct,
      totalProjectCost: projectCost,
      residence: {
        pincode: residencePincode,
        state: residenceState,
        address1: residenceAddress,
        district: residenceDistrict,
      },
      plantAddress: {
        pincode: plantPincode,
        state: plantState,
        address1: plantAddress,
        district: plantDistrict,
      },
      documents: documentUrls,
    };

    // Save to ProjectReport
    const projectReport = await prisma.projectReport.create({
      data: {
        userId:userId as string,
        projectId: project.id,
        status: 'Pending',
        paymentStatus: 'Pending',
        paymentAmount: new Prisma.Decimal(project.projectReportCost),
        applicationData,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully', data: projectReport },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing project report application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process application' },
      { status: 500 }
    );
  }
}