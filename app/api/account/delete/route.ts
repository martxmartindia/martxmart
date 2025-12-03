import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper function to check pending orders
async function hasUnresolvedOrders(userId: string, role: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
      status: { notIn: ['DELIVERED', 'CANCELLED'] }
    }
  });
  return orders.length > 0;
}

// Helper function to check pending refunds

async function hasPendingRefunds(userId: string, role: string) {  
  // Implement refund check logic based on your refund system
  // TODO: Implement refund check logic
  return false; // Placeholder
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reason } = await req.json();
    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for pending orders/refunds
    const hasOrders = await hasUnresolvedOrders(userId as string, user.role);
    const hasRefunds = await hasPendingRefunds(userId as string, user.role);

    if (hasOrders || hasRefunds) {
      return NextResponse.json({
        error: 'Cannot delete account with pending orders or refunds',
        hasOrders,
        hasRefunds
      }, { status: 400 });
    }

    // Set retention period based on user role
    const retentionDays = user.role === 'VENDOR' ? 365 : 180;
    const dataRetentionUntil = new Date();
    dataRetentionUntil.setDate(dataRetentionUntil.getDate() + retentionDays);

    // Update user record with deletion request
    await prisma.user.update({
      where: { id: userId },
      data: {
        deletionRequestedAt: new Date(),
        deletionReason: reason,
        dataRetentionUntil,
      }
    });

    // Send confirmation email/notification (implement separately)

    return NextResponse.json({
      message: 'Account deletion request submitted successfully',
      retentionDays
    });

  } catch (error) {
    console.error('Account deletion request error:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.deletionRequestedAt) {
      return NextResponse.json(
        { error: 'No deletion request found' },
        { status: 400 }
      );
    }

    // Soft delete the account
    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletionApprovedAt: new Date(),
      }
    });

    return NextResponse.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}