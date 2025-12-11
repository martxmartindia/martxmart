"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuth } from '@/store/auth';

const otpSchema = z.object({
    otp_0: z.string().length(1, 'Please enter a digit').regex(/^\d$/, 'Must be a number'),
    otp_1: z.string().length(1, 'Please enter a digit').regex(/^\d$/, 'Must be a number'),
    otp_2: z.string().length(1, 'Please enter a digit').regex(/^\d$/, 'Must be a number'),
    otp_3: z.string().length(1, 'Please enter a digit').regex(/^\d$/, 'Must be a number'),
});

export default function OTPVerifyPage() {
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(30);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setToken, setUser } = useAuth();
    const phone = searchParams.get('phone');

    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    useEffect(() => {
        if (!phone) {
            router.replace('/auth/login');
            return;
        }

        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearInterval(timer);
    }, [countdown, phone, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
        if (value.length === 1 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        } else if (value.length === 0 && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !e.currentTarget.value) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit = async (data: z.infer<typeof otpSchema>) => {
        if (!phone) return;
        setLoading(true);
        try {
            const otp = Object.values(data).join('');
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            setToken(result.token);
            setUser(result.user);
            toast.success("success")

            router.push('/account');
        } catch (error: any) {            
            toast.error(error.message || 'Failed to verify OTP')
            reset();
            inputRefs[0].current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!phone || resendDisabled) return;
        try {
            setLoading(true);
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            toast.success("success")

            setCountdown(30);
            setResendDisabled(true);
        }catch (error: any) {
                toast.error(error.message || 'Failed to resend OTP')
            }
         finally {
            setLoading(false);
        } 
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-xl shadow-lg p-6 m-2 bg-white">
                <div className="text-center">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className="mx-auto" />
                    <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>
                    <p className="mt-2 text-gray-600">
                        Enter the OTP sent to +{phone}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <div className="flex justify-between gap-2">
                            {inputRefs.map((ref, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="one-time-code"
                                    aria-label={`OTP digit ${index + 1}`}
                                    {...register(`otp_${index}` as keyof z.infer<typeof otpSchema>)}
                                    ref={(e) => {
                                        ref.current = e;
                                        return undefined;
                                    }}
                                    maxLength={1}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className={`w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${errors[`otp_${index}` as keyof z.infer<typeof otpSchema>] ? 'border-red-500' : ''}`}
                                />
                            ))}
                        </div>
                        {Object.keys(errors).length > 0 && (
                            <p className="mt-1 text-sm text-red-500 text-center" role="alert">
                                Please enter valid numbers in all fields
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Didn&apos;t receive OTP?{' '}
                        <button
                            onClick={handleResendOTP}
                            disabled={resendDisabled}
                            className={`text-orange-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed`}
                        >
                            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
