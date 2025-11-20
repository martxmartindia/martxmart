import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear the token cookie
  (await
        // Clear the token cookie
        cookies()).set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
  })

  return NextResponse.json({ success: true })
}

 