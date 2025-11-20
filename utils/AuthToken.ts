import axios from "axios";
import { cookies } from "next/headers";

export async function AuthToken() {
    try {
      const API_KEY = process.env.SANDBOX_API_KEY;
      const API_SECRET = process.env.SANDBOX_API_SECRET;
  
      const url = "https://api.sandbox.co.in/authenticate";
  
      const response = await axios.post(
        url,
        {}, // Empty body
        {
          headers: {
            accept: "application/json",
            "x-api-key": API_KEY,
            "x-api-secret": API_SECRET,
            "x-api-version": "1.0.0"
          }
        }
      );
  
      console.log("Sandbox Auth Token:", response.data);
      return response.data;
  
    } catch (error:any) {
      console.error("Error fetching Auth Token:", error.response?.data || error.message);
      throw error;
    }
  }

export async function EbillAccessToken() {
  try {
    const cookieStore =await cookies();
const authToken = cookieStore.get("auth-token");
    if (!authToken) {
      throw new Error("Auth Token not found in cookies");
    }
    const userName = process.env.EBILL_USER_NAME;
    const password = process.env.EBILL_PASSWORD;
    const gstin = process.env.EBILL_GSTIN;
    const SANDBOX_API_KEY = process.env.SANDBOX_API_KEY;

    const BEARER_TOKEN = authToken.value;
    const url = "https://api.sandbox.co.in/gst/compliance/e-way-bill/tax-payer/authenticate";

    const response = await axios.post(
      url,
      {
        username: userName,
        password: password,
        gstin: gstin
      },
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${BEARER_TOKEN}`,
          "content-type": "application/json",
          "x-api-key": SANDBOX_API_KEY,
          "x-api-version": "1.0.0",
          "x-source": "primary"
        }
      }
    );

    console.log("Ebill Token Response:", response.data);
    return response.data;

  } catch (error:any) {
    console.error("Ebill Token Error:", error?.response?.data || error.message);
    throw error;
  }
}
