import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { AuthProvider } from "@/store/auth";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { AdminProvider } from "@/store/admin";
import { CartProvider } from "@/store/cart";
import { AuthorProvider } from "@/store/author";
import { WishlistProvider } from "@/store/wishlist";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "martXmart - Industrial Machinery B2B Marketplace",
  description:
    "India's leading B2B marketplace for industrial machinery, equipment, and tools. Connect with verified suppliers and buyers across the manufacturing sector.",
  keywords:
    "industrial machinery, manufacturing equipment, B2B marketplace, machinery suppliers, industrial tools, factory equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <WishlistProvider>
                <AuthorProvider>
                  <ChatProvider>
                    <main>{children}</main>
                    <Toaster position="top-right" richColors />
                    <Script
                      src="https://checkout.razorpay.com/v1/checkout.js"
                      strategy="lazyOnload"
                    />
                  </ChatProvider>
                </AuthorProvider>
              </WishlistProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
