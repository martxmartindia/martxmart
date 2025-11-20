"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { FranchiseSidebar } from "@/components/franchise-sidebar"

export default  function FranchisePortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const user = "admin"
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <FranchiseSidebar  />
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}
