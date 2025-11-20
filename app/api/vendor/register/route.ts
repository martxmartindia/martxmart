import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/utils/auth';
import { prisma } from '@/lib/prisma';
import { Role,AddressType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const {
      businessName,
      email,
      password,
      phoneNumber,
      businessType,
      gstin,
      panNumber,
      address,
      city,
      state,
      pincode
    } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phoneNumber }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or phone number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and vendor profile in a transaction
    await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          phone: phoneNumber,
          password: hashedPassword,
          role: Role.VENDOR,
          name: businessName
        }
      });

      // Create vendor profile
      const vendorProfile = await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          businessName,
          businessType,
         gstNumber: gstin,
          panNumber,
          isVerified: false
        }
      });

      // Create address for vendor
      await prisma.address.create({
        data: {
          userId: user.id,
          contactName:"",
          phone: phoneNumber,
          type: AddressType.BILLING,
          addressLine1: address as string,
          addressLine2: '',
          city,
          state,
          zip: pincode
        }
      });

      return { user, vendorProfile };
    });

    return NextResponse.json(
      { message: 'Registration successful! Please wait for admin approval.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor registration error:', error);
    return NextResponse.json(
      { message: 'Failed to register vendor' },
      { status: 500 }
    );
  }
}