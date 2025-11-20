"use client"

import type React from "react"
import { Navbar } from "@/components/shopping/NavBar"
import { Footer } from "@/components/shopping/Footer"
import NewsletterSignup from "@/components/NewsletterSignup"
import { ShoppingProvider } from "@/store/shopping"

export default function ShoppingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ShoppingProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <NewsletterSignup/>
        <Footer />
      </div>
    </ShoppingProvider>
  )
}
