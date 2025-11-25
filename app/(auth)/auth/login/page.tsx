"use client";

import { useState } from "react";
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
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, Phone, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter phone number or email"),
  password: z.string().min(1, "Password is required"),
  loginMethod: z.enum(["phone", "email"]),
}).refine(
  (data) => {
    if (data.loginMethod === "phone") {
      return /^[6-9]\d{9}$/.test(data.identifier);
    } else {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);
    }
  },
  {
    message: "Invalid phone number or email format",
    path: ["identifier"],
  }
);

export default function CustomerLoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const router = useRouter();
  const { user, setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginMethod: "phone",
    },
  });

  const identifierValue = watch("identifier");

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    
    try {
      // Determine if identifier is email or phone
      const method = isEmail(data.identifier) ? "email" : "phone";
      
      // Use NextAuth credentials provider for login
      const result = await signIn("credentials", {
        redirect: false,
        [method]: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid credentials");
      } else if (result?.ok) {
        toast.success("Login successful!");
        
        // Update auth store
        try {
          const session = await fetch("/api/auth/session").then(r => r.json());
          if (session?.user) {
            setUser(session.user);
          }
        } catch (error) {
          console.error("Failed to get session:", error);
        }
        
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Failed to login. Please try again.");
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
                alt="MartXMart"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </Link>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Customer Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Login Method Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  type="button"
                  variant={loginMethod === "phone" ? "default" : "ghost"}
                  className={`flex-1 ${loginMethod === "phone" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                  onClick={() => setLoginMethod("phone")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </Button>
                <Button
                  type="button"
                  variant={loginMethod === "email" ? "default" : "ghost"}
                  className={`flex-1 ${loginMethod === "email" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                  onClick={() => setLoginMethod("email")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>

              {/* Identifier Field */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-gray-700 font-medium">
                  {loginMethod === "phone" ? "Phone Number" : "Email Address"}
                </Label>
                <div className="relative">
                  {loginMethod === "phone" ? (
                    <>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm">
                        +91
                      </span>
                      <Input
                        id="identifier"
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        maxLength={10}
                        {...register("identifier")}
                        className="pl-12 py-3 text-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        disabled={loading}
                        autoComplete="tel"
                      />
                    </>
                  ) : (
                    <>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="identifier"
                        type="email"
                        placeholder="john@example.com"
                        {...register("identifier")}
                        className="pl-10 py-3 text-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </>
                  )}
                </div>
                {errors.identifier && (
                  <p className="text-sm text-red-500">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pl-10 pr-10 py-3 text-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-200 text-white font-medium py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

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
                  Forgot password?
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