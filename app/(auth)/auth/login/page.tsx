"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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

const loginSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Phone number must start with 6, 7, 8, or 9")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
}).refine((data) => data.phone || data.email, {
  message: "Either phone number or email is required.",
  path: ["phone", "email"],
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const router = useRouter();
const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    resetField,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const passwordValue = watch("password");
  const passwordStrength = passwordValue
    ? passwordValue.length >= 10 && /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue)
      ? "strong"
      : passwordValue.length >= 6
      ? "medium"
      : "weak"
    : null;

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem("token", result.token);
          setUser(result.user);
          toast.success(result.message);
          router.push("/");
        } else {
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setPassword(data.password);
          setStep(2);
          toast.success(result.message);
        }
      } else {
        toast.error(result.message);
      }
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
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        toast.success(result.message);
        router.push("/");
      } else {
        toast.error(result.message || "Invalid OTP");
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
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("OTP resent successfully");
        setTimeout(() => setCanResend(true), 30000);
      } else {
        toast.error(result.message);
        setCanResend(true);
      }
    } catch (error: any) {
      toast.error("Failed to resend OTP. Please try again.");
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset fields when switching login method
  useEffect(() => {
    resetField("phone");
    resetField("email");
  }, [loginMethod, resetField]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black-to-br from-black-500 via-black to-black-500">
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
        <Card className="border-none shadow-xl bg-black/900 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <Link href="/" className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </Link>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {step === 1 ? "Welcome Back" : "Verify Your Phone"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 1
                ? "Sign in to continue your journey"
                : "Enter the 4-digit code sent to your phone"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        variant={loginMethod === "phone" ? "default" : "outline"}
                        className={`flex-1 ${loginMethod === "phone" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-300"}`}
                        onClick={() => setLoginMethod("phone")}
                        disabled={loading}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </Button>
                      <Button
                        type="button"
                        variant={loginMethod === "email" ? "default" : "outline"}
                        className={`flex-1 ${loginMethod === "email" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-300"}`}
                        onClick={() => setLoginMethod("email")}
                        disabled={loading}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                    <Label
                      htmlFor="identifier"
                      className="text-gray-700 font-medium"
                    >
                      {loginMethod === "phone" ? "Phone Number" : "Email Address"}
                    </Label>
                    <div className="relative">
  {/* Country Code and Icon */}
  {loginMethod === "phone" ? (
    <>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm">
        +91
      </span>
    </>
  ) : (
    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  )}

  {/* Input Field */}
  <Input
    id="identifier"
    type={loginMethod === "phone" ? "tel" : "email"}
    inputMode={loginMethod === "phone" ? "numeric" : "email"}
    placeholder={loginMethod === "phone" ? "9876543210" : "john@example.com"}
    maxLength={loginMethod === "phone" ? 10 : undefined}
    {...register(loginMethod === "phone" ? "phone" : "email")}
    className={`
      w-full py-2.5 pr-4 rounded-md shadow-sm
      ${loginMethod === "phone" ? "pl-12" : "pl-12"}
      text-sm text-gray-900 placeholder-gray-400 bg-white
      border ${errors.phone || errors.email ? "border-red-500" : "border-gray-300"}
      focus:outline-none focus:ring-2 
      ${errors.phone || errors.email ? "focus:ring-red-500" : "focus:ring-orange-500"}
      transition-all duration-200 ease-in-out
    `}
    disabled={loading}
    aria-invalid={errors.phone || errors.email ? "true" : "false"}
    aria-describedby="identifier-description"
  />
</div>

                    {(errors.phone || errors.email) && (
                      <p className="text-sm text-red-500" id="identifier-description">
                        {errors.phone?.message || errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        className={`pr-10 transition-all duration-200 ${
                          errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500"
                        }`}
                        disabled={loading}
                        aria-invalid={errors.password ? "true" : "false"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {passwordStrength && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>Password strength:</span>
                        <span
                          className={`font-medium ${
                            passwordStrength === "strong"
                              ? "text-green-500"
                              : passwordStrength === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-200 text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log in"
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
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-center block">
                      Verification Code
                    </Label>
                    <div className="flex justify-center gap-2">
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 text-2xl text-center rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                          disabled={loading}
                          aria-label={`OTP digit ${index + 1}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-center text-gray-500 mt-4">
                      Didn't receive the code?{" "}
                      <Button
                        variant="link"
                        className="text-orange-600 p-0 font-medium hover:text-orange-700"
                        onClick={handleResendOTP}
                        disabled={loading || !canResend}
                      >
                        Resend {canResend ? "" : "(wait 30s)"}
                      </Button>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-orange-50 transition-all duration-200"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change phone number
                  </Button>
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
              <p>
                <Link
                  href="/auth/forgot-password"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}