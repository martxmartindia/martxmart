import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { validatePAN, getSandboxHeaders } from "@/utils/auth"

const BASE_URL=process.env.SANDBOX_BASE_URL!
export async function POST(request: NextRequest) {

  try {
    const body = await request.json()
    const { pan, name_as_per_pan } = body

    if (!pan || !name_as_per_pan ) {
      return NextResponse.json(
        { success: false, message: "PAN, name, and date of birth are required" },
        { status: 400 },
      )
    }

    // Validate PAN format
    if (!validatePAN(pan)) {
      return NextResponse.json({ success: false, message: "Invalid PAN format" }, { status: 400 })
    }


    try {
      // Use the Sandbox.co.in API for PAN verification
      const response = await axios.post(
        `${BASE_URL}/api/verify/pan` ,
        {
          pan: pan,
          name_as_per_pan: name_as_per_pan,
          consent: "Y",
          reason: "For vendor onboarding",
        },
        {
          headers: getSandboxHeaders(),
        },
      )

      // Process the response data to extract relevant information
      const panData = {
        name: response.data.name || name_as_per_pan,
        status: response.data.status || "Active",
        category: response.data.category || "Individual",
        aadhaarLinked: response.data.aadhaarLinked || false,
      }

      return NextResponse.json({ success: true, data: panData }, { status: 200 })
    } catch (apiError: any) {
      console.error("Sandbox API error:", apiError.response?.data || apiError.message)
      // Check if the error is due to name mismatch
      if (apiError.response?.data?.message?.toLowerCase().includes("name") || apiError.response?.status === 422) {
        return NextResponse.json(
          {
            success: false,
            message: "Name does not match PAN records or PAN details are incorrect",
          },
          { status: 400 },
        )
      }

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
