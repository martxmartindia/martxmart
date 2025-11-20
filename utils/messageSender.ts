import axios from "axios";

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY!;
const FAST2SMS_SENDER_ID = process.env.FAST2SMS_SENDER_ID!; // e.g., "WHSMRT"
const FAST2SMS_MESSAGE_ID = process.env.FAST2SMS_MESSAGE_ID!; // e.g., "185399"

interface Fast2SMSResponse {
  type: "success" | "error";
  message: string;
  request_id?: string;
}

/**
 * ✅ Send OTP via Fast2SMS DLT Route
 * @param phone - Phone number (e.g., 9999999999)
 * @param otp - Generated OTP
 * @returns Promise<Fast2SMSResponse>
 */
export async function sendOTP(phone: string, otp: string): Promise<Fast2SMSResponse> {
  if (!phone || !otp) {
    throw new Error("Phone number and OTP are required.");
  }

  // Ensure environment variables are defined
  if (!FAST2SMS_API_KEY || !FAST2SMS_SENDER_ID || !FAST2SMS_MESSAGE_ID) {
    throw new Error("Fast2SMS API key, sender ID, or message ID is not configured.");
  }

  // Clean phone number
  const cleanPhone = phone.replace(/^\+?91/, "").trim();
  if (!/^\d{10}$/.test(cleanPhone)) {
    throw new Error("Invalid phone number format. Must be 10 digits.");
  }

  const url = "https://www.fast2sms.com/dev/bulkV2";

  try {
    const response = await axios.post(
      url,
      {
        route: "dlt",
        sender_id: FAST2SMS_SENDER_ID,
        message: FAST2SMS_MESSAGE_ID, // Pre-approved DLT message ID
        variables_values: otp, // Assuming the DLT template has one variable for OTP
        numbers: cleanPhone,
      },
      {
        headers: {
          authorization: FAST2SMS_API_KEY,
          "Content-Type": "application/json",
          Accept: "*/*",
          "Cache-Control": "no-cache",
        },
      }
    );

    // Check Fast2SMS response
    if (response.data.return === false) {
      return {
        type: "error",
        message: response.data.message || "Failed to send OTP.",
      };
    }

    return {
      type: "success",
      message: "OTP sent successfully",
      request_id: response.data.request_id,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to send OTP. Please try again.";
    console.error("❌ Fast2SMS DLT Error:", errorMessage, error.response?.data);

    return {
      type: "error",
      message: errorMessage,
    };
  }
}

/**
 * ✅ Verify OTP (Placeholder for backend verification)
 * @param phone - Phone number
 * @param otp - OTP to verify
 * @returns Promise<Fast2SMSResponse>
 */
export async function verifyOTP(phone: string, otp: string): Promise<Fast2SMSResponse> {
  if (!phone || !otp) {
    throw new Error("Phone number and OTP are required.");
  }

  const cleanPhone = phone.replace(/^\+?91/, "").trim();
  if (!/^\d{10}$/.test(cleanPhone)) {
    throw new Error("Invalid phone number format. Must be 10 digits.");
  }

  return {
    type: "success",
    message: "OTP verification must be handled on the backend",
  };
}