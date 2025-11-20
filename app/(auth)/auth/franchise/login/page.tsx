"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
});

export default function FranchiseLoginPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitPhone = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/franchise/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      const result = await response.json();

      if (response.ok) {
        setPhone(data.phone);
        setStep(2);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = async (otp: string) => {
    if (otp.length !== 4) return;
    setLoading(true);
    try {
      const response = await fetch("/api/auth/franchise/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push("/franchise");
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2" />
        Back
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Franchise Login</CardTitle>
          <CardDescription className="text-center">
            Enter your phone number to login as a franchise
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 4) {
                      if (value.length === 4) {
                        onSubmitOTP(value);
                      }
                    }
                  }}
                />
              </div>
              <p className="text-sm text-center">
                Didn't receive OTP?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setStep(1)}
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}