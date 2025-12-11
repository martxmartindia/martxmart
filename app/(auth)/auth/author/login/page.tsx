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
import { useSession } from "next-auth/react";
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
import { Mail, ArrowLeft, Eye, EyeOff, Loader2, PenTool } from "lucide-react";
import { motion } from "framer-motion";

const authorLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthorLoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof authorLoginSchema>>({
    resolver: zodResolver(authorLoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof authorLoginSchema>) => {
    setLoading(true);

    try {
      const result = await signIn("author-credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid credentials");
      } else if (result?.ok) {
        toast.success("Author login successful!");
        router.push("/author/dashboard");
      }
    } catch (error: any) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-white to-green-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
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
              Author Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your author dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="author@example.com"
                    {...register("email")}
                    className="pl-10 py-3 border-gray-300 focus:ring-green-500 focus:border-green-500"
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
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
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pr-10 py-3 border-gray-300 focus:ring-green-500 focus:border-green-500"
                    disabled={loading}
                    autoComplete="current-password"
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-medium py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-4 w-4" />
                    Sign in as Author
                  </>
                )}
              </Button>
            </motion.form>

            <div className="mt-6 text-center text-sm space-y-2">
              <p>
                <Link
                  href="/auth/forgot-password"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </p>
              
              <div className="flex flex-col space-y-2 mt-4">
                <p className="text-gray-600 text-xs">Other login options:</p>
                <div className="flex justify-center gap-2">
                  <Link
                    href="/auth/login"
                    className="text-orange-600 hover:text-orange-700 text-xs font-medium transition-colors"
                  >
                    Customer Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/auth/admin/login"
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
                  >
                    Admin Login
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
