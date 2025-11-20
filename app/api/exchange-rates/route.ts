import { NextResponse } from 'next/server';

const EXCHANGE_RATES = {
  USD: 0.012, // 1 INR = 0.012 USD
  EUR: 0.011, // 1 INR = 0.011 EUR
  GBP: 0.0095, // 1 INR = 0.0095 GBP
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');

    if (!currency || !EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES]) {
      return NextResponse.json(
        { message: 'Invalid currency' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      rate: EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES],
      base: 'INR',
      currency,
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json(
      { message: 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
}