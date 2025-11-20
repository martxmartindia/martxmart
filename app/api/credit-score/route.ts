import { NextRequest, NextResponse } from 'next/server';

// Mock credit data - replace with actual API integration
const creditData = {
  users: new Map(),
  subscriptions: new Map(),
  creditReports: new Map()
};

// Simulate credit bureau API
const simulateCreditScore = (pan: string) => {
  const scores = [650, 720, 780, 690, 750, 800, 620, 740];
  const hash = pan.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return scores[hash % scores.length];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'check_score':
        return await checkCreditScore(data);
      case 'subscribe':
        return await subscribePlan(data);
      case 'refresh_score':
        return await refreshScore(data);
      case 'get_report':
        return await getCreditReport(data);
      case 'verify_otp':
        return await verifyOTP(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Credit Score API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkCreditScore(data: any) {
  const { pan, mobile, consent } = data;
  
  if (!consent) {
    return NextResponse.json({ error: 'Consent required' }, { status: 400 });
  }

  // Simulate OTP requirement
  const otpRequired = !data.otpVerified;
  if (otpRequired) {
    return NextResponse.json({
      otpRequired: true,
      message: 'OTP sent to your mobile number',
      sessionId: `session_${Date.now()}`
    });
  }

  const score = simulateCreditScore(pan);
  const userId = `user_${pan}`;
  
  // Store user data
  creditData.users.set(userId, {
    pan,
    mobile,
    lastScore: score,
    lastChecked: new Date().toISOString(),
    checksRemaining: 0
  });

  return NextResponse.json({
    success: true,
    creditScore: score,
    status: getScoreStatus(score),
    message: 'Credit score fetched successfully',
    requiresSubscription: true
  });
}

async function subscribePlan(data: any) {
  const { userId, planId, paymentId } = data;
  
  const plans = {
    starter: { price: 99, duration: 0, checks: 1 },
    basic: { price: 129, duration: 30, checks: 1 },
    standard: { price: 299, duration: 90, checks: 3 },
    premium: { price: 499, duration: 180, checks: 6 },
    elite: { price: 800, duration: 365, checks: -1 } // unlimited
  };

  const plan = plans[planId as keyof typeof plans];
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const subscriptionId = `sub_${Date.now()}`;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.duration);

  creditData.subscriptions.set(subscriptionId, {
    userId,
    planId,
    price: plan.price,
    startDate: new Date().toISOString(),
    expiryDate: expiryDate.toISOString(),
    checksRemaining: plan.checks,
    active: true,
    paymentId
  });

  return NextResponse.json({
    success: true,
    subscriptionId,
    message: 'Subscription activated successfully',
    expiryDate: expiryDate.toISOString()
  });
}

async function refreshScore(data: any) {
  const { userId, subscriptionId } = data;
  
  const subscription = creditData.subscriptions.get(subscriptionId);
  if (!subscription || !subscription.active) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  if (new Date() > new Date(subscription.expiryDate)) {
    return NextResponse.json({ error: 'Subscription expired' }, { status: 400 });
  }

  const user = creditData.users.get(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const newScore = simulateCreditScore(user.pan);
  user.lastScore = newScore;
  user.lastChecked = new Date().toISOString();

  if (subscription.checksRemaining > 0) {
    subscription.checksRemaining--;
  }

  return NextResponse.json({
    success: true,
    creditScore: newScore,
    status: getScoreStatus(newScore),
    checksRemaining: subscription.checksRemaining,
    message: 'Score refreshed successfully'
  });
}

async function getCreditReport(data: any) {
  const { userId } = data;
  
  const user = creditData.users.get(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const report = {
    personalInfo: {
      name: 'John Doe',
      pan: user.pan,
      mobile: user.mobile,
      address: 'Mumbai, Maharashtra'
    },
    creditScore: user.lastScore,
    creditAccounts: [
      {
        type: 'Credit Card',
        bank: 'HDFC Bank',
        limit: 200000,
        outstanding: 45000,
        status: 'Active'
      },
      {
        type: 'Personal Loan',
        bank: 'ICICI Bank',
        amount: 500000,
        outstanding: 125000,
        status: 'Active'
      }
    ],
    creditHistory: {
      totalAccounts: 5,
      activeAccounts: 3,
      closedAccounts: 2,
      oldestAccount: '2018-03-15',
      creditAge: '6 years 8 months'
    },
    paymentHistory: {
      onTimePayments: 95,
      latePayments: 2,
      missedPayments: 0
    },
    creditUtilization: 23,
    inquiries: {
      last6Months: 2,
      last12Months: 4
    }
  };

  return NextResponse.json({
    success: true,
    report,
    generatedAt: new Date().toISOString()
  });
}

async function verifyOTP(data: any) {
  const { sessionId, otp } = data;
  
  // Simulate OTP verification
  if (otp === '123456') {
    return NextResponse.json({
      success: true,
      verified: true,
      message: 'OTP verified successfully'
    });
  }

  return NextResponse.json({
    success: false,
    message: 'Invalid OTP'
  }, { status: 400 });
}

function getScoreStatus(score: number) {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Poor';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const action = searchParams.get('action');

  if (action === 'subscription_status' && userId) {
    const subscriptions = Array.from(creditData.subscriptions.values())
      .filter(sub => sub.userId === userId && sub.active);
    
    return NextResponse.json({
      subscriptions,
      hasActiveSubscription: subscriptions.length > 0
    });
  }

  if (action === 'user_data' && userId) {
    const user = creditData.users.get(userId);
    return NextResponse.json({ user: user || null });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}