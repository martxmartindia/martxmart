import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number');
export const pincodeSchema = z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid pincode');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  originalPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().uuid('Invalid category ID'),
  brand: z.string().min(1).max(100).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10),
  weight: z.number().min(0.01).optional(),
  dimensions: z.string().max(100).optional(),
  hsnCode: z.string().max(20).optional(),
  isFeatured: z.boolean().optional(),
  isFestival: z.boolean().optional(),
  festivalType: z.string().max(50).optional(),
  attributes: z.record(z.any()).optional(),
});

// Order validation
export const orderSchema = z.object({
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'COD', 'UPI', 'NET_BANKING']),
  notes: z.string().max(500).optional(),
});

// Address validation
export const addressSchema = z.object({
  type: z.enum(['BILLING', 'DISPATCH']),
  contactName: z.string().min(1, 'Contact name is required').max(100),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  addressLine1: z.string().min(5, 'Address line 1 is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zip: pincodeSchema,
  placeOfSupply: z.string().max(100).optional(),
});

// User validation
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  password: passwordSchema,
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number is required',
});

export const userLoginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

// Review validation
export const reviewSchema = z.object({
  shoppingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, 'Comment is required').max(1000),
});

// Cart validation
export const addToCartSchema = z.object({
  shoppingId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
});

export const updateCartSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().min(0).max(100),
});

// Shipping validation
export const shippingRateSchema = z.object({
  pickupPincode: pincodeSchema,
  deliveryPincode: pincodeSchema,
  weight: z.number().min(0.1),
  orderValue: z.number().min(1),
  isCOD: z.boolean().optional().default(false),
});

// Admin validation
export const adminProductSchema = productSchema.extend({
  id: z.string().uuid().optional(),
  isDeleted: z.boolean().optional(),
});

export const adminOrderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  notes: z.string().max(1000).optional(),
});

// Utility functions
export function validateIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function validatePincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

export function validateGST(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

export function validatePAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function validateImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
  } catch {
    return false;
  }
}
