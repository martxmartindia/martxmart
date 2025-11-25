import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Script from "next/script";
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
        <ErrorBoundary>
          <Providers>
            <main>{children}</main>
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyOnload"
            />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
