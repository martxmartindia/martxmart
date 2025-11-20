import Razorpay from 'razorpay';
import axios from 'axios';
import crypto from 'crypto';
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const BASE_URL = "https://api.razorpay.com/v1"


export interface CreateOrderOptions {
  amount: number; // Amount in paise
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(options: CreateOrderOptions) {
  try {
    const order = await razorpay.orders.create({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `receipt_${Date.now()}`,
      notes: options.notes || {},
    });
    
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
}

export async function captureRazorpayPayment(paymentId: string, amount: number, currency: string) {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount, currency);
    return payment;
  } catch (error) {
    console.error('Error capturing Razorpay payment:', error);
    throw new Error('Failed to capture payment');
  }
}


// Configure RazorpayX
const razorpayX = {
  key_id: process.env.RAZORPAYX_KEY_ID!,
  key_secret: process.env.RAZORPAYX_KEY_SECRET!,
  account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER!,
}

// Create basic auth header
const getBasicAuthHeader = (key_id: string, key_secret: string) => {
  return `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString("base64")}`
}

// Create a payment order
export async function createPaymentOrder(amount: number, receipt: string, notes: any = {}) {
  try {
    const response = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt,
      notes,
    })

    return response
  } catch (error) {
    console.error("Error creating payment order:", error)
    throw error
  }
}

// Verify payment signature
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const text = `${orderId}|${paymentId}`
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(text).digest("hex")

  return expectedSignature === signature
}

// Process RazorpayX payout
export async function processRazorpayXPayout({
  amount,
  account,
  ifsc,
  name,
  reference,
}: {
  amount: number
  account: string
  ifsc: string
  name: string
  reference: string
}) {
  try {
    // Create contact if not exists
    const contactResponse = await axios.post(
      `${BASE_URL}/contacts`,
      {
        name,
        type: "vendor",
        reference_id: reference,
      },
      {
        headers: {
          Authorization: getBasicAuthHeader(razorpayX.key_id, razorpayX.key_secret),
        },
      },
    )

    const contactId = contactResponse.data.id

    // Create fund account
    const fundAccountResponse = await axios.post(
      `${BASE_URL}/fund_accounts`,
      {
        contact_id: contactId,
        account_type: "bank_account",
        bank_account: {
          name,
          ifsc,
          account_number: account,
        },
      },
      {
        headers: {
          Authorization: getBasicAuthHeader(razorpayX.key_id, razorpayX.key_secret),
        },
      },
    )

    const fundAccountId = fundAccountResponse.data.id

    // Create payout
    const payoutResponse = await axios.post(
      `${BASE_URL}/payouts`,
      {
        account_number: razorpayX.account_number,
        fund_account_id: fundAccountId,
        amount,
        currency: "INR",
        mode: "IMPS",
        purpose: "vendor_payment",
        queue_if_low_balance: true,
        reference_id: reference,
        narration: `Vendor Payout - ${reference}`,
      },
      {
        headers: {
          Authorization: getBasicAuthHeader(razorpayX.key_id, razorpayX.key_secret),
        },
      },
    )

    return payoutResponse.data
  } catch (error) {
    console.error("Error processing RazorpayX payout:", error)
    throw error
  }
}

// Verify webhook signature
export function verifyWebhookSignature(signature: string, body: string) {
  if (!signature) return false

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAYX_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")

  return expectedSignature === signature
}

export default razorpay
