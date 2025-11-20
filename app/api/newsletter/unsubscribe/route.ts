import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { unsubscribeConfirmationEmail } from '@/email/template';

// Email validation schema
const unsubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate email
    const { email } = unsubscribeSchema.parse(body);

    if (!email) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email exists in newsletter list
    const existingEmail = await prisma.newsletter.findUnique({
      where: {
        email,
      },
    });

    if (!existingEmail) {
      return NextResponse.json(
        { message: 'Email not found in newsletter list' },
        { status: 404 }
      );
    }

    // Remove email from newsletter database
    await prisma.newsletter.delete({
      where: {
        email,
      },
    });
    // Send confirmation email
    unsubscribeConfirmationEmail(email);
    
    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
} 