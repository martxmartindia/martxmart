import { NextResponse } from "next/server";
import { EbillAccessToken } from "@/utils/AuthToken";
import { cookies } from "next/headers";
import cron from "node-cron";
export async function GET() {
  try {
    cron.schedule("0 */6 * * *",async () => {
      EbillAccessToken();
    });
    const cookieStore =await cookies();

    const result = await EbillAccessToken();
    cookieStore.set("EbillAccessToken", result);
    return NextResponse.json({ success: true, token: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
