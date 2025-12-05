import { NextResponse } from "next/server"
import axios from "axios"
import { validatePAN, getSandboxAccessToken, getSandboxAPIHeaders } from "@/utils/auth"

export async function POST(request: Request) {
  try {
    const BASE_URL = process.env.SANDBOX_BASE_URL!
    const { pan, name_as_per_pan, date_of_birth } = await request.json()

    if (!pan || !name_as_per_pan || !date_of_birth ) {
      return NextResponse.json(
        { success: false, message: "All fields are required: pan, name_as_per_pan, date_of_birth" },
        { status: 400 },
      )
    }

    // Validate PAN format
    if (!validatePAN(pan)) {
      return NextResponse.json({ success: false, message: "Invalid PAN format" }, { status: 400 })
    }

    try {
      // Get access token
      const accessToken = await getSandboxAccessToken()

      // Use the Sandbox.co.in API for PAN verification
      const response = await axios.post(
        `${BASE_URL}/kyc/pan/verify`,
        {
          "@entity": "in.co.sandbox.kyc.pan_verification.request",
          pan,
          name_as_per_pan,
          date_of_birth,
          consent:"Y",
          reason:"KYC_VERIFICATION",
        },
        {
          headers: getSandboxAPIHeaders(accessToken),
        },
      )

      // Process the response data
      const panData = response.data

      return NextResponse.json({ success: true, data: panData }, { status: 200 })
    } catch (apiError: any) {
      console.error("Sandbox API error:", apiError.response?.data || apiError.message)
      return NextResponse.json(
        {
          success: false,
          message: "PAN verification failed. Please check your details and try again.",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying PAN:", error)
    return NextResponse.json({ success: false, message: "Failed to verify PAN details" }, { status: 500 })
  }
}
