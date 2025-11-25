"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, Phone, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Phone number must start with 6, 7, 8, or 9"),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<z.infer<typeof registerSchema> | null>(null);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password");
  const passwordStrength = passwordValue
    ? passwordValue.length >= 8 && /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue)
      ? "strong"
      : passwordValue.length >= 6
      ? "medium"
      : "weak"
    : null;

  const onSubmitRegistration = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        setRegistrationData(data);
        setStep(2);
        toast.success("OTP sent successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
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
    if (!registrationData || otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: registrationData.phone, 
          otp,
          fullName: registrationData.name
        }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("Account activated successfully! You can now login.");
        router.push("/auth/login");
      } else {
        toast.error(result.message || "Failed to verify OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
                alt="Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </Link>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {step === 1 ? "Create Account" : "Verify Your Phone"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 1
                ? "Join us today by filling in your details"
                : "Enter the 4-digit code sent to your phone"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit(onSubmitRegistration)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className={`pl-10 transition-all duration-200 ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-orange-500"
                        }`}
                        disabled={loading}
                        aria-invalid={errors.name ? "true" : "false"}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium text-sm">
                        +91
                      </span>
                                            <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        maxLength={10}
                        {...register("phone")}
                        className={`pl-10 transition-all duration-200 ${
                          errors.phone
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-orange-500"
                        }`}
                        disabled={loading}
                        aria-invalid={errors.phone ? "true" : "false"}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className={`pl-10 transition-all duration-200 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-orange-500"
                        }`}
                        disabled={loading}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        className={`pl-10 transition-all duration-200 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-orange-500"
                        }`}
                        disabled={loading}
                        aria-invalid={errors.password ? "true" : "false"}
                      />
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
                        Creating account...
                      </>
                    ) : (
                      "Create account"
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
                        onClick={() => onSubmitRegistration(registrationData!)}
                        disabled={loading}
                      >
                        Resend
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
                    Change details
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link
                href="/auth/login"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}