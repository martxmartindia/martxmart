"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, Mail, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const phoneLoginSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Phone number must start with 6, 7, 8, or 9"),
});

export default function CustomerLoginPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof phoneLoginSchema>>({
    resolver: zodResolver(phoneLoginSchema),
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onSubmitPhone = async (data: z.infer<typeof phoneLoginSchema>) => {
    setLoading(true);
    setPhone(data.phone);
    
    try {
      // First, generate and send OTP
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          purpose: "CUSTOMER_LOGIN",
        }),
      });

      const otpResult = await otpResponse.json();

      if (!otpResponse.ok) {
        toast.error(otpResult.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      toast.success("OTP sent successfully");
      setStep(2);
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (newOtpValues.every((val) => val !== "")) {
      onSubmitOTP(newOtpValues.join(""));
    }
  };

  const onSubmitOTP = async (otp: string) => {
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }
    setLoading(true);
    
    try {
      const result = await signIn("customer-mobile-otp", {
        phone: phone,
        otp: otp,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid OTP");
      } else if (result?.ok) {
        toast.success("Login successful!");
        
        // Update auth store
        const session = await fetch("/api/auth/session").then(r => r.json());
        if (session?.user) {
          setUser(session.user);
        }
        
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(30); // 30 seconds cooldown
    
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          purpose: "CUSTOMER_LOGIN",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("OTP resent successfully");
        setOtpValues(["", "", "", ""]);
        setTimeout(() => setCanResend(true), 30000);
      } else {
        toast.error(result.message);
        setCanResend(true);
        setResendTimer(0);
      }
    } catch (error: any) {
      toast.error("Failed to resend OTP. Please try again.");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors"
          onClick={() => router.back()}
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <Link href="/" className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="MartXMart"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </Link>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {step === 1 ? "Customer Login" : "Verify Your Phone"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 1
                ? "Enter your mobile number to receive OTP"
                : "Enter the 4-digit code sent to your phone"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="phone-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit(onSubmitPhone)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 font-medium"
                    >
                      Mobile Number
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        maxLength={10}
                        {...register("phone")}
                        className="pl-12 py-3 text-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        disabled={loading}
                        autoComplete="tel"
                        autoFocus
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-200 text-white font-medium py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      OTP sent to +91 {phone}
                    </p>
                    
                    <div className="flex justify-center gap-3 mb-6">
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 text-xl text-center rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                          disabled={loading}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-center text-gray-500 mb-4">
                      Didn't receive the code?{" "}
                      <Button
                        variant="link"
                        className="text-orange-600 p-0 font-medium hover:text-orange-700"
                        onClick={handleResendOTP}
                        disabled={loading || !canResend}
                      >
                        Resend {canResend ? "" : `(${resendTimer}s)`}
                      </Button>
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-orange-50 transition-all duration-200"
                    onClick={() => {
                      setStep(1);
                      reset();
                      setOtpValues(["", "", "", ""]);
                    }}
                    disabled={loading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change phone number
                  </Button>

                  {loading && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                      <span className="ml-2 text-sm text-gray-600">Verifying OTP...</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center text-sm space-y-2">
              <p>
                <span className="text-gray-600">Don't have an account?</span>{" "}
                <Link
                  href="/auth/register"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
              
              <div className="flex flex-col space-y-2 mt-4">
                <p className="text-gray-600 text-xs">Other login options:</p>
                <div className="flex justify-center gap-2">
                  <Link
                    href="/auth/admin/login"
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
                  >
                    Admin Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/auth/author/login"
                    className="text-green-600 hover:text-green-700 text-xs font-medium transition-colors"
                  >
                    Author Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/auth/franchise/login"
                    className="text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
                  >
                    Franchise Login
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}