import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pincode = searchParams.get("pincode");

    if (!pincode) {
      return NextResponse.json(
        { success: false, message: "Pincode is required" },
        { status: 400 }
      );
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { success: false, message: "Invalid pincode format" },
        { status: 400 }
      );
    }

    // Use India Post API or similar service for pincode verification
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

    if (response.data && response.data[0]?.Status === "Success") {
      const postOffice = response.data[0].PostOffice?.[0];

      return NextResponse.json(
        {
          success: true,
          data: {
            district: postOffice?.District || "",
            state: postOffice?.State || "",
            country: postOffice?.Country || "India",
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid pincode" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying pincode:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify pincode" },
      { status: 500 }
    );
  }
}
