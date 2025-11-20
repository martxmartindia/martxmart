"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { Loader2 } from "lucide-react";
import AuthFooter from "@/components/layout/auth-footer";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN" || user.role === "VENDOR") {
        router.push(`/${user.role.toLowerCase()}/login`);
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" aria-label="Loading" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8"
        >
            <AnimatePresence mode="wait">{children}</AnimatePresence>
        </motion.div>
      </main>
      <AuthFooter />
    </div>
  );
}