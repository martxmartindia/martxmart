import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-helpers';

interface VerificationData {
  gstVerified: boolean;
  panVerified: boolean;
  bankVerified: boolean;
  gstData: any | null;
  panData: any | null;
  bankData: any | null;
}

interface Document {
  type: 'GST' | 'PAN' | 'BANK' | 'OTHER';
  url: string;
}

const validateDocuments = (documents: any[]): documents is Document[] => {
  if (!Array.isArray(documents)) return false;
  return documents.every(
    (doc) =>
      doc &&
      typeof doc === 'object' &&
      typeof doc.type === 'string' &&
      typeof doc.url === 'string' &&
      ['GST', 'PAN', 'BANK', 'OTHER'].includes(doc.type),
  );
};

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.id;
    const formData = await request.formData();

    // Extract form fields
    const businessName = formData.get('businessName') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const pincode = formData.get('pincode') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string | null;
    const gstNumber = formData.get('gstNumber') as string | null;
    const panNumber = formData.get('panNumber') as string | null;
    const bankName = formData.get('bankName') as string | null;
    const accountNumber = formData.get('accountNumber') as string | null;
    const ifscCode = formData.get('ifscCode') as string | null;
    const dateOfBirth = formData.get('dateOfBirth') as string | null;
    const nameAsPerPan = formData.get('nameAsPerPan') as string | null;
    const gstVerified = formData.get('gstVerified') === 'true';
    const panVerified = formData.get('panVerified') === 'true';
    const bankVerified = formData.get('bankVerified') === 'true';
    const gstData = formData.get('gstData') ? JSON.parse(formData.get('gstData') as string) : null;
    const panData = formData.get('panData') ? JSON.parse(formData.get('panData') as string) : null;
    const bankData = formData.get('bankData') ? JSON.parse(formData.get('bankData') as string) : null;
    const documents: Document[] = formData.get('documents') ? JSON.parse(formData.get('documents') as string) : [];

    // Validate required fields
    const requiredFields = ['businessName', 'address', 'city', 'state', 'pincode', 'phone', 'email'];
    const missingFields = requiredFields.filter((field) => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Validate documents
    if (!validateDocuments(documents)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid document format',
        },
        { status: 400 },
      );
    }

    // Check if the user exists and is eligible
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    // Check for existing vendor profile or pending application
    const [existingProfile, existingApplication] = await Promise.all([
      prisma.vendorProfile.findUnique({
        where: { userId: userId as string },
      }),
      prisma.vendorApplication.findFirst({
        where: {
          userId: userId as string,
          status: 'PENDING',
        },
      }),
    ]);

    if (existingProfile) {
      return NextResponse.json(
        { success: false, message: 'User already has a vendor profile' },
        { status: 400 },
      );
    }

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: 'User already has a pending application' },
        { status: 400 },
      );
    }

    // Prepare verification data
    const verificationData: VerificationData = {
      gstVerified,
      panVerified,
      bankVerified,
      gstData,
      panData,
      bankData,
    };

    // Create vendor application
    const vendorApplication = await prisma.vendorApplication.create({
      data: {
        description: '', // Adding required description field with empty string as default
        userId: userId as string,
        businessName,
        address,
        city,
        state,
        pincode,
        phone,
        email,
        website: website || null,
        gstNumber: gstNumber || null,
        panNumber: panNumber || null,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        status: 'PENDING',
        verificationData: verificationData as unknown as Record<string, any>,
      },
    });

    // Create VendorDocument records for uploaded documents
    if (documents.length > 0) {
      await prisma.vendorDocument.createMany({
        data: documents.map((doc) => ({
          vendorProfileId: vendorApplication.id, // Using application ID temporarily until profile is created
          documentType: doc.type,
          documentUrl: doc.url,
          isVerified: false,
        })),
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          applicationId: vendorApplication.id,
          message: 'Application submitted successfully',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating vendor application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process vendor application' },
      { status: 500 },
    );
  }
}

export async function PUT( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) { 
  const id = (await params).id;
  try {
    // Authenticate user
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 

    const body = await request.json();

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 },
      );
    }

    // Update application status
    const vendorApplication = await prisma.vendorApplication.update({
      where: { id },
      data: {
        status: body.status,
        verificationData: body.verificationData || undefined,
      },
    });

    // If application is approved, create vendor profile
    if (body.status === 'APPROVED') {
      const verificationData = vendorApplication.verificationData as unknown as VerificationData;

      const vendorProfile = await prisma.vendorProfile.create({
        data: {
          businessType: 'RETAIL', // Adding required businessType field with default value
          userId: vendorApplication.userId,
          businessName: vendorApplication.businessName,
          address: vendorApplication.address,
          city: vendorApplication.city,
          state: vendorApplication.state,
          pincode: vendorApplication.pincode,
          phone: vendorApplication.phone,
          email: vendorApplication.email,
          website: vendorApplication.website,
          gstNumber: vendorApplication.gstNumber,
          panNumber: vendorApplication.panNumber,
          bankName: vendorApplication.bankName,
          accountNumber: vendorApplication.accountNumber,
          ifscCode: vendorApplication.ifscCode,
          isVerified: verificationData.gstVerified || verificationData.panVerified || verificationData.bankVerified,
          verificationData: verificationData as unknown as Record<string, any>,
        },
      });

      // Update VendorDocument records to link to the new vendor profile
      await prisma.vendorDocument.updateMany({
        where: { vendorProfileId: vendorApplication.id },
        data: { vendorProfileId: vendorProfile.id },
      });

      // Update user role to VENDOR
      await prisma.user.update({
        where: { id: vendorApplication.userId },
        data: { role: 'VENDOR' },
      });
    }

    return NextResponse.json({
      success: true,
      data: vendorApplication,
    });
  } catch (error) {
    console.error('Error updating vendor application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update vendor application' },
      { status: 500 },
    );
  }
}