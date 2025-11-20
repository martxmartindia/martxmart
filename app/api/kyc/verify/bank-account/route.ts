import { NextResponse } from "next/server"
import axios from "axios"
import { validateIFSC, validateAccountNumber, getSandboxHeaders } from "@/utils/auth"
const BASE_URL=process.env.SANDBOX_BASE_URL!

export async function POST(request: Request) {
  try {
    const { ifsc, account_number } = await request.json()    

    if (!ifsc || !account_number) {
      return NextResponse.json(
        { success: false, message: "IFSC code and account number are required" },
        { status: 400 },
      )
    }

    // Validate IFSC format
    if (!validateIFSC(ifsc)) {
      return NextResponse.json({ success: false, message: "Invalid IFSC code format" }, { status: 400 })
    }

    // Validate account number format
    if (!validateAccountNumber(account_number)) {
      return NextResponse.json({ success: false, message: "Invalid account number format" }, { status: 400 })
    }

    try {
      // Use the Sandbox.co.in API for bank account verification
      const response = await axios.post(
        `${BASE_URL}/api/verify/ban`,
        {
         ifsc: ifsc,
         accountNumber: account_number, 
        },
        {
          headers: getSandboxHeaders(),
        },
        
      )

      // Process the response data
      const bankData = {
        account_exists: response.data.account_exists || false,
        name_at_bank: response.data.name_at_bank || "Account Holder",
        bank_name: response.data.bank_name || "",
        branch: response.data.branch || "",
        message: response.data.message || "Bank account details verified successfully",
      }

      if (!bankData.account_exists) {
        return NextResponse.json(
          {
            success: false,
            message: "Bank account could not be verified",
          },
          { status: 400 },
        )
      }

      return NextResponse.json({ success: true, data: bankData }, { status: 200 })
    } catch (apiError: any) {
      console.error("Sandbox API error:", apiError.response?.data || apiError.message)
      return NextResponse.json(
        {
          success: false,
          message: "Bank account verification failed. Please check your details and try again.",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying bank account:", error)
    return NextResponse.json({ success: false, message: "Failed to verify bank account details" }, { status: 500 })
  }
}
