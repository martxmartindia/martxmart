import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to validate PAN format
export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

// Function to validate GST format
export function validateGST(gst: string): { success: boolean; message: string } {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

  if (gstRegex.test(gst)) {
    return {
      success: true,
      message: "Valid GST number format",
    }
  } else {
    return {
      success: false,
      message: "Invalid GST number format",
    }
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
    accept: "application/json",
    "x-client-id": process.env.SANDBOX_API_CLIENT_ID!,
    "x-client-secret": process.env.SANDBOX_API_CLIENT_SCRET!,
    "x-product-instance-id": process.env.SANDBOX_PRODUCTION_INSTANCE_ID!,
  }
}

// Format currency
export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Generate random string
export function generateRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Truncate text
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Calculate percentage
export function calculatePercentage(value: number, total: number) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)  // ✅ spread operator used
  }) as T
}


// Sleep function
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateOrderNumber() {
  const date = new Date()
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${randomStr}`
}
