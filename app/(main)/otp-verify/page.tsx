import { Suspense } from "react";
import OTPVerifyPage from "./OTPVerify";
export default function OtpVerify(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <OTPVerifyPage/>
    </Suspense>
  )
}