import { NextResponse } from "next/server";
import { AuthToken } from "@/utils/AuthToken";
import { cookies } from "next/headers";
import cron from "node-cron";
export async function GET() {
  try {
    cron.schedule("0 0 * * *",async  () => {
      AuthToken();
    });
    const cookieStore =await cookies();
    const result = await AuthToken();
    cookieStore.set("auth-token", result);
    return NextResponse.json({ success: true, token: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
