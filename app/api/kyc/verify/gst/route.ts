import { NextResponse } from "next/server"
import axios from "axios"
import { validateGST, getSandboxHeaders } from "@/utils/auth"

const headers=getSandboxHeaders()
export async function POST(request: Request) {
  try {
    const BASE_URL=process.env.SANDBOX_BASE_URL!    
    const { gstin } = await request.json()

    if (!gstin) {
      return NextResponse.json({ success: false, message: "GST number is required" }, { status: 400 })
    }

    // Validate GST format
    if (!validateGST(gstin)) {
      return NextResponse.json({ success: false, message: "Invalid GST number format" }, { status: 400 })
    }

    try {
      // Use the Sandbox.co.in API for GST verification
      const response = await axios.post(
        `${BASE_URL}/api/verify/gst`,
        { gstin },
        {
          headers: getSandboxHeaders(),
        },
      )


      // Process the response data to extract relevant information
      const gstData = response.data

      return NextResponse.json({ success: true, data: gstData }, { status: 200 })
    } catch (apiError: any) {
      console.error("Sandbox API error:", apiError.response?.data || apiError.message)

      return NextResponse.json({ 
        success: false, 
        message: "GST verification failed. Please check the GST number and try again." 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in POST request:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}