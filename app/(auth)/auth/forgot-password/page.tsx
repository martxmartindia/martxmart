"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';

const forgotPasswordSchema = z.object({
  identifier: z.string().nonempty("Please enter a phone number or email address"),
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers")
    .optional(),
  newPassword: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .optional(),
}).refine(
  (data) => {
    if (!data.otp && !data.newPassword) return !!data.identifier; // Step 1 validation
    if (data.newPassword && !data.otp) return false; // OTP required if newPassword is set
    return true;
  },
  { message: "OTP is required for password reset", path: ["otp"] }
).refine(
  (data) => {
    if (data.newPassword && data.identifier) {
      const identifierParts = data.identifier.split(/[@.]+/); // Split email by @ and .
      const phoneDigits = data.identifier.replace(/\D/g, ''); // Get only digits from phone

      if (identifierParts.some(part => part.length > 2 && data.newPassword!.toLowerCase().includes(part.toLowerCase()))) {
        return false;
      }
      if (phoneDigits.length > 3 && data.newPassword!.includes(phoneDigits)) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Password should not contain parts of your email or phone number.",
    path: ["newPassword"],
  }
);

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: New Password
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    setValue,
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Mock user location check (replace with actual API call)
  useEffect(() => {
    // Example: Fetch user location from API or context
    // For demo, assume Bihar user if phone starts with +91
    if (identifier.startsWith("+91") || identifier.includes("bihar")) {
    }
  }, [identifier]);

  const onSubmitIdentifier = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    try {
      const payload = isEmail(data.identifier)
        ? { email: data.identifier }
        : { phone: data.identifier.replace(/^\+?91/, "").trim() };
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        setIdentifier(data.identifier);
        setStep(2);
        toast.success(
          "otp sent, proceed to set new password."
        )
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = (value: string) => {
    if (value.length === 4 && /^\d+$/.test(value)) {
      setOtp(value);
      setValue('otp', value); // Set OTP in form for password reset
      setStep(3);
      // Toast message can be removed or updated as OTP is not verified here anymore
      // toast.success(
      //   isBiharUser
      //     ? 'OTP entered, proceed to set new password.'
      //     : 'OTP entered. Proceed to set new password.'
      // );
    }
  };

  const onSubmitNewPassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
    if (!data.newPassword || !data.otp) return;
    setLoading(true);
    try {
      const payload = {
        [isEmail(identifier) ? 'email' : 'phone']: identifier,
        otp: data.otp,
        newPassword: data.newPassword,
      };
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully');
        router.push('/auth/login');
      } else {
        toast.error(result.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl shadow-lg p-6 m-2 bg-white">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="martXmart Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">
            {step === 1
             ? 'Enter your mobile number or email to receive an OTP.'
             : 'Enter your new password.'}
             
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmitIdentifier)} className="space-y-6">
            <Input
              type="text"
              placeholder="Mobile Number or Email"
              {...register('identifier')}
              className={errors.identifier ? 'border-red-500' : ''}
              aria-label="Mobile Number or Email"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">{errors.identifier.message}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value;
                onSubmitOTP(value);
              }}
              className="text-center text-2xl tracking-wide"
              aria-label="Enter 4-digit OTP"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep(1);
                resetField('identifier');
                setIdentifier('');
              }}
              disabled={loading}
            >
              Change Phone or Email
            </Button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmitNewPassword)} className="space-y-6">
            <Input
              type="password"
              placeholder="New Password (min 8 chars, A-Z, a-z, 0-9, special)"
              {...register('newPassword')}
              className={errors.newPassword ? 'border-red-500' : ''}
              aria-label="New Password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
            Password Minimum 6 Character
            </p>
            <Input
              type="hidden"
              value={otp}
              {...register('otp')}
            />
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-orange-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}