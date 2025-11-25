import bcryptjs from 'bcryptjs';
import * as jose from 'jose';


interface TokenPayload {
  id: string
  email?: string
  name: string
  role: string
}
// Generate OTP for 4 digit number
export const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcryptjs.compare(password, hashedPassword);
};
export const signJWT = async (payload: TokenPayload, type: 'access' | 'refresh' = 'access') => {
  const secret = new TextEncoder().encode(
    type === 'access' ? process.env.JWT_SECRET! : process.env.JWT_SECRET!
  );
  return await new jose.SignJWT({ ...payload } as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(type === 'access' ? '15d' : '30d')
    .sign(secret);
}

export const verifyJWT = async (token: string, type: 'access' | 'refresh' = 'access') => {
  try {
    const secret = new TextEncoder().encode(
      type === 'access' ? process.env.JWT_SECRET! : process.env.JWT_SECRET!
    );
    const decoded = await jose.jwtVerify(token, secret);
    return decoded;
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      const err = new Error('Token expired');
      err.name = 'TokenExpiredError';
      err.cause = { type };
      throw err;
    }
    if (error.code === 'ERR_JWS_INVALID' || error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      const err = new Error('Invalid token');
      err.name = 'InvalidTokenError';
      err.cause = { type };
      throw err;
    }
    throw error;
  }
}; 

export const removeToken = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// This file contains utility functions for verification APIs

// Function to validate PAN format
export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

// Function to validate GST format
export function validateGST(gst: string): { success: boolean; message: string } {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (gstRegex.test(gst)) {
    return {
      success: true,
      message: "Valid GST number format",
    };
  } else {
    return {
      success: false,
      message: "Invalid GST number format",
    };
  }
}


// Function to validate IFSC format
export function validateIFSC(ifsc: string): boolean {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  return ifscRegex.test(ifsc)
}

// Function to validate date format (DD/MM/YYYY)
export function validateDateFormat(date: string): boolean {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
  return dateRegex.test(date)
}

// Function to validate account number
export function validateAccountNumber(accountNumber: string): boolean {
  // Account number should be numeric and at least 9 digits
  return /^\d{9,18}$/.test(accountNumber)
}

// Function to get Sandbox API headers
export function getSandboxHeaders() {
  return {
    "accept": "application/json",
      'x-client-id': process.env.SANDBOX_API_CLIENT_ID!,
      'x-client-secret': process.env.SANDBOX_API_CLIENT_SCRET!,
      'x-product-instance-id': process.env.SANDBOX_PRODUCTION_INSTANCE_ID!,
  }
}
