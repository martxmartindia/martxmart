'use client';

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/store/auth";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { AdminProvider } from "@/store/admin";
import { CartProvider } from "@/store/cart";
import { AuthorProvider } from "@/store/author";
import { WishlistProvider } from "@/store/wishlist";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <WishlistProvider>
              <AuthorProvider>
                <ChatProvider>
                  {children}
                  <Toaster position="top-right" richColors />
                </ChatProvider>
              </AuthorProvider>
            </WishlistProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </SessionProvider>
  );
}