"use client"

import type React from "react"
import { VendorSidebar } from "@/components/vendor-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function VendorPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <SidebarProvider>
        <VendorSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
  )
}
