import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const affiliate = await prisma.user.findUnique({
      where: { id: userId as string },
      select: {
        id: true,
        commissions: true,
      },
    });

    if (!affiliate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const affiliateData = {
      userId: affiliate.id,
      coins: affiliate.commissions.length * 100, // 100 coins per commission
      referralCode: `REF${affiliate.id.slice(0, 8)}`,
      referredUsers: affiliate.commissions.length,
    };

    return NextResponse.json(affiliateData);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}