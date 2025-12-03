import bcrypt from 'bcryptjs';

// Password Functions
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// OTP Functions
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sandbox API Headers
export function getSandboxHeaders() {
  const API_KEY = process.env.SANDBOX_API_KEY;
  const API_SECRET = process.env.SANDBOX_API_SECRET;

  if (!API_KEY || !API_SECRET) {
    throw new Error('Sandbox API credentials not configured');
  }

  return {
    accept: "application/json",
    "x-api-key": API_KEY,
    "x-api-secret": API_SECRET,
    "x-api-version": "1.0.0",
    "x-source": "primary"
  };
}

// Validation Functions
export function validateIFSC(ifsc: string): boolean {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.toUpperCase());
}

export function validateAccountNumber(accountNumber: string): boolean {
  // Basic validation - should be 9-18 digits
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(accountNumber);
}

export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

export function validateGST(gst: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
}