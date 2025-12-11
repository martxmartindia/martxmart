"use client"

import type React from "react"
import Link from "next/link"
import { VendorSidebar } from "@/components/vendor-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function VendorPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <VendorSidebar />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-accent" />
            
            <div className="flex flex-1 items-center gap-4">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products, orders..."
                  className="w-full rounded-lg bg-gray-50 pl-10 md:w-[200px] lg:w-[300px] border-0 focus:bg-white focus:shadow-md transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-500">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent">
                    <Avatar className="h-8 w-8 ring-2 ring-orange-100">
                      <AvatarImage src="/avatars/vendor.png" alt="Vendor" />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatars/vendor.png" alt="Vendor" />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold leading-none">John Vendor</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            vendor@example.com
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/vendor-portal/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gray-50/30">
            <div className="container mx-auto p-6 min-h-full">
              <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[calc(100vh-8rem)]">
                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
