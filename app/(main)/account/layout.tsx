"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Package, Heart, LogOut, FileText, Bell, MapPin, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user,logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
  }

  const navItems = [
    {
      label: "Account Details",
      href: "/account",
      icon: <User className="h-4 w-4 mr-2" />,
      active: pathname === "/account",
    },
    {
      label: "My Orders",
      href: "/account/orders",
      icon: <Package className="h-4 w-4 mr-2" />,
      active: pathname === "/account/orders" || pathname.startsWith("/account/orders/"),
    },
    {
      label: "My Quotations",
      href: "/account/quotations",
      icon: <FileText className="h-4 w-4 mr-2" />,
      active: pathname === "/account/quotations",
    },
    {
      label:"View Coupons",
      href:"/account/coupons",
      icon:<Heart className="h-4 w-4 mr-2" />,
      active: pathname === "/account/favorites",
    },
    {
      label:"Track Applications",
      href:"/account/applications",
      icon:<Bell className="h-4 w-4 mr-2" />,
      active: pathname === "/account/applications",
    },
    {
      label:"Projects Reports",
      href:"/account/project-reports",
      icon:<MapPin className="h-4 w-4 mr-2" />,
      active:pathname ==="/account/projects-reports",
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hello, {user?.name || "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-md ${item.active ? "bg-orange-50 text-orange-600 font-medium" : "hover:bg-gray-100"}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          {/* Main Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

