import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/utils/auth';

export async function GET(request: Request) {
  const token = (await cookies()).get("token")?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = await verifyJWT(token)

  if (!decoded || typeof decoded !== "object" || !decoded.payload || !decoded.payload.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = decoded.payload.id
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